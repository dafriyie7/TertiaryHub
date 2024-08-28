const express = require('express');
const router = express.Router();
const {
    renderSignup,
    renderLogin,
    renderForgotPassword,
    signup,
    login,
    logout,
    resetPassword,
    verifyEmail,
    resetPasswordForm,
    updatePassword
} = require('../controllers/authController');

// pages rendering
router.get('/signup', renderSignup);
router.get('/login', renderLogin);
router.get('/forgot-password', renderForgotPassword);

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.get('/reset-password/:token', resetPasswordForm);
router.post('/reset-password/:token', updatePassword);

module.exports = router;