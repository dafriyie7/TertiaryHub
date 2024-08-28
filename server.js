const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');
const errorHandler = require('./middleware/errorMiddleware');
const passport = require('./config/passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');

// Connect to the database
connectDB();

const app = express();

app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override for PUT and DELETE
app.use(methodOverride('_method'));

// Session configuration for user sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in
    httpOnly: true // Prevent client-side JavaScript from accessing the cookie
  }
}));

// Middleware to renew session expiration on each request
app.use((req, res, next) => {
  if (req.session) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
});

// Initialize Passport and use sessions
app.use(passport.initialize());
app.use(passport.session());

// Flash messages for displaying notifications
app.use(flash());

// Middleware to set flash messages in locals for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware to set user information in locals for views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Default route to redirect to the files dashboard
app.get('/', (req, res) => {
  res.redirect('/files/dashboard');
});

// Route handling
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));