const asyncHandler = require('express-async-handler');
const File = require('../models/fileModel');
const path = require('path');
const nodemailer = require('nodemailer');
const dbx = require('../config/dropbox');
const upload = require('../config/multer');
const { isAdmin } = require('../middleware/authMiddleware');

// @desc Get all files or search results
// @route GET /files/dashboard
// @access private
const renderDashboard = asyncHandler(async (req, res) => {
  try {
    // Get search query from request, default to empty string if not provided
    const query = req.query.query || '';
    let files;

    // Perform search if query is provided, otherwise fetch all files
    if (query) {
      files = await File.find({ title: new RegExp(query, 'i') }); // Search by title
    } else {
      files = await File.find({});
    }

    // Render the dashboard view with files and user info
    res.render('dashboard', { files, isAdmin: req.user.isAdmin, query });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Server Error');
  }
});

// @desc Search for file
// @route GET /files/search
// @access public
const searchFile = asyncHandler(async (req, res) => {
  try {
    // Get search query from request, default to empty string if not provided
    const query = req.query.query || '';
    // Search for files by title
    const files = await File.find({ title: new RegExp(query, 'i') });

    if (!files.length) {
      return res.status(404).json({ error: 'No files found' });
    }
    res.status(200).json(files);
  } catch (error) {
    console.error('Error searching files:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc Upload file
// @route POST /files/upload
// @access private
const uploadFile = asyncHandler(async (req, res) => {
  // Handling file upload with multer
  upload.single('file')(req, res, async (err) => {
    if (err) {
      req.flash('error_msg', `Upload error: ${err.message}`);
      return res.redirect('/files/dashboard');
    }

    const { title, description } = req.body;
    const uploadedBy = req.user ? req.user._id : null;

    // Validate title and description
    if (!title || !description) {
      req.flash('error_msg', 'Title and description are required');
      return res.redirect('/files/dashboard');
    }

    try {
      // Sanitize title to create a valid filename (optional)
      const sanitizedTitle = title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_'); // Replace invalid characters
      const fileExtension = path.extname(req.file.originalname); // Get the original file extension
      const fileName = `${sanitizedTitle}${fileExtension}`;

      // Upload file to Dropbox
      const fileContent = req.file.buffer;
      const dropboxResponse = await dbx.filesUpload({
        path: `/${fileName}`,
        contents: fileContent,
        mode: 'add',
        autorename: true,
        mute: false,
      });

      // Save file information to the database
      const file = new File({
        title,
        description,
        path: dropboxResponse.result.path_display, // Save Dropbox path
        uploadedBy,
        downloadCount: 0, // Initialize download count
        shareCount: 0, // Initialize share count
      });

      await file.save();
      req.flash('success_msg', 'File uploaded and saved successfully');
      res.redirect('/files/dashboard');
    } catch (err) {
      console.error('Error uploading file:', err);
      req.flash('error_msg', 'Failed to upload file. Please try again.');
      res.redirect('/files/dashboard');
    }
  });
});



// @desc Download file
// @route GET /files/download/:id
// @access private
const downloadFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    // Find the file by ID
    const file = await File.findById(id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Fetch file content from Dropbox
    const dropboxResponse = await dbx.filesDownload({ path: file.path });
    const fileContent = dropboxResponse.result.fileBinary;
    const fileName = path.basename(file.path);

    const mimeType = dropboxResponse.result['.tag'] === 'file' ? dropboxResponse.result.media_info?.metadata?.mime_type || 'application/octet-stream' : 'application/octet-stream';

    // Set headers and send file content
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);
    res.send(Buffer.from(fileContent, 'binary'));

    // Increment download count and save
    file.downloadCount = (file.downloadCount || 0) + 1;
    await file.save();
  } catch (error) {
    console.error('Error downloading file:', error);
    req.flash('error_msg', 'Error downloading file. Please try again.');
    res.redirect('/files/dashboard');
  }
});


// @desc Delete file
// @route DELETE /files/delete/:id
// @access private
const deleteFile = asyncHandler(async (req, res) => {
  try {
    // Find the file by ID
    const file = await File.findById(req.params.id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Delete file from Dropbox
   await dbx.filesDeleteV2({ path: file.path });

    // Delete the file record from the database
    const result = await File.findByIdAndDelete(req.params.id);
    if (!result) {
      req.flash('error_msg', 'Failed to delete file record from database');
      return res.redirect('/files/dashboard');
    }

    req.flash('success_msg', 'File deleted successfully');
    res.redirect('/files/dashboard');
  } catch (err) {
    console.error('Error during file deletion:', err);
    req.flash('error_msg', 'Failed to delete file. Please try again.');
    res.redirect('/files/dashboard');
  }
});

// @desc Share file via email
// @route POST /files/share/:id
// @access private
const shareFile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Find the file by ID
    const file = await File.findById(id);
    if (!file) {
      req.flash('error_msg', 'File not found');
      return res.redirect('/files/dashboard');
    }

    // Fetch file content from Dropbox
    const dropboxResponse = await dbx.filesDownload({ path: file.path });
    const fileContent = dropboxResponse.result.fileBinary;
    const fileName = path.basename(file.path);

    // Determine MIME type
    const mimeType = dropboxResponse.result['.tag'] === 'file' ? dropboxResponse.result.media_info?.metadata?.mime_type || 'application/octet-stream' : 'application/octet-stream';

    // Configure the email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Set up email options with attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `File: ${file.title}`,
      text: `This file was sent to you from ${email}: ${file.title}`,
      attachments: [
        {
          filename: fileName,
          content: fileContent,
          contentType: mimeType
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update share count in the database
    file.shareCount = (file.shareCount || 0) + 1;
    await file.save();

    req.flash('success_msg', 'File shared successfully');
    res.redirect('/files/dashboard');
  } catch (error) {
    console.error('Error sharing file:', error);
    req.flash('error_msg', 'Error sharing file. Please try again.');
    res.redirect('/files/dashboard');
  }
});


module.exports = {
  searchFile,
  uploadFile,
  downloadFile,
  deleteFile,
  shareFile,
  renderDashboard
};