const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype); // Check MIME type
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check file extension
    
    if (mimetype && extname) {
      return cb(null, true); // Accept file
    }
    cb(new Error('File type not supported')); // Reject file
  }
});

module.exports = upload;