const User = require('../models/userModel');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// @desc Render Signup Page
// @route GET /auth/signup
// @access Public
const renderSignup = (req, res) => {
    res.render('signup');
};

// @desc Render Login Page
// @route GET /auth/login
// @access Public
const renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/files/dashboard'); // Redirect if already logged in
    }
    res.render('login'); // Render login page
};

// @desc Render Forgot Password Page
// @route GET /auth/forgot-password
// @access Public
const renderForgotPassword = (req, res) => {
    res.render('forgot-password');
};

// @desc Register user
// @route POST /auth/signup
// @access Public
const signup = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        req.flash('error_msg', 'User already exists');
        return res.status(400).redirect('/auth/signup');
    }

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.status(400).redirect('/auth/signup');
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationToken: uuidv4() // Generate a verification token
    });

    if (user) {
        req.flash('success_msg', 'Registration successful. Please check your email for verification.');
        res.redirect('/auth/login');

        // Send verification email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Account Verification',
            text: `Please verify your account by clicking the following link: 
            http://${req.headers.host}/auth/verify-email?token=${user.verificationToken}`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.error('Error sending verification email:', err);
            } else {
                console.log('Verification email sent.');
            }
        });
    } else {
        req.flash('error_msg', 'Invalid user data');
        res.status(400).redirect('/auth/signup');
    }
});

// @desc Login user
// @route POST /auth/login
// @access Public
const login = passport.authenticate('local', {
    successRedirect: '/files/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
});

// @desc Logout user
// @route GET /auth/logout
// @access Private
const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass error to global handler
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
};

// @desc Send password reset email
// @route POST /auth/forgot-password
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        req.flash('error_msg', 'User not found');
        return res.status(404).redirect('/auth/forgot-password');
    }

    // Generate reset token
    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset password email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste it into your browser to complete the process:
        http://${req.headers.host}/auth/reset-password/${resetToken}`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error('Error sending password reset email:', err);
        } else {
            console.log('Password reset email sent.');
        }
    });

    req.flash('success_msg', 'Password reset email sent');
    res.redirect('/auth/forgot-password');
});

// @desc Verify user email
// @route GET /auth/verify-email
// @access Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        req.flash('error_msg', 'Invalid verification token');
        return res.status(400).redirect('/auth/login');
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    req.flash('success_msg', 'Email verified. You can now log in.');
    res.redirect('/auth/login');
});

// @desc Render Reset Password Form
// @route GET /reset-password/:token
// @access Private
const resetPasswordForm = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token is valid
    });

    if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.status(400).redirect('/auth/forgot-password');
    }

    res.render('reset-password', { token }); // Render reset password form
});

// @desc Update password
// @route POST /reset-password/:token
// @access Private
const updatePassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.status(400).redirect(`/auth/reset-password/${token}`);
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token is valid
    });

    if (!user) {
        req.flash('error_msg', 'Password reset token is invalid or has expired.');
        return res.status(400).redirect('/auth/forgot-password');
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success_msg', 'Password has been updated');
    res.redirect('/auth/login');
});

module.exports = {
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
};