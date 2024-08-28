const express = require('express');
const router = express.Router();
const {
    renderLoginSignup,
    renderForgotPassword,
    renderHome,
    renderAbout,
    renderContact,
    renderCourseFinder,
    renderResultChecker,
    renderNoticeBoard,
    renderTertiaries,
    signup,
    login,
    logout,
    resetPassword,
    verifyEmail,
    resetPasswordForm,
    updatePassword
} = require('../controllers/authController');

// pages rendering
router.get('/signup', renderLoginSignup);
router.get('/login', renderLoginSignup);
router.get('/forgot-password', renderForgotPassword);
router.get('/home', renderHome);
router.get('/about', renderAbout);
router.get('/contact-us', renderContact);
router.get('/find-course', renderCourseFinder);
router.get('/check-results', renderResultChecker);
router.get('/notice-board', renderNoticeBoard)
router.get('/tertiaries', renderTertiaries);

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.get('/reset-password/:token', resetPasswordForm);
router.post('/reset-password/:token', updatePassword);

module.exports = router;