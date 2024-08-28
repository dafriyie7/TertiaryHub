const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec(); // Find user by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Local strategy for username/password login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email }); // Find user by email

        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }

        const isMatch = await user.matchPassword(password); // Check password

        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        if (!user.verified) {
            return done(null, false, { message: 'Email not verified.' });
        }

        return done(null, user); // Successful authentication
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;