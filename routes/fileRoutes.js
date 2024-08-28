const express = require('express');
const router = express.Router();
const { Authenticated, isAdmin } = require('../middleware/authMiddleware');
const {
    searchFile,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,
    renderDashboard
} = require('../controllers/fileController');

router.get('/dashboard', Authenticated, renderDashboard);
router.post('/upload', Authenticated, isAdmin, uploadFile);
router.delete('/delete/:id', Authenticated, isAdmin, deleteFile);
router.get('/download/:id', Authenticated, downloadFile);
router.post('/share/:id', Authenticated, shareFile);
router.get('/search', Authenticated, searchFile);

module.exports = router;