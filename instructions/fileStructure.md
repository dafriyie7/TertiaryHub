# File Structure

├── config/                     // Configuration files
│   └── db.js                   // Database connection setup
├── controllers/                // Controllers for handling business logic
│   ├── authController.js       // Controller for authentication related actions
│   ├── adminController.js      // Controller for admin related actions
│   └── fileController.js       // Controller for file handling actions
├── middleware/                 // Middleware functions
│   ├── authMiddleware.js       // Middleware for authentication and authorization
│   └── errorMiddleware.js      // Middleware for handling errors
├── models/                     // Mongoose models for MongoDB
│   ├── userModel.js            // User schema and model definition
│   └── fileModel.js            // File schema and model definition
├── routes/                     // Express routes
│   ├── authRoutes.js           // Routes for authentication (signup, login, reset password)
│   ├── fileRoutes.js           // Routes for handling files (upload, download, delete)
│   └── adminRoutes.js          // Routes for admin operations
├── views/                      // EJS view templates
│   ├── login.ejs               // Login page template
│   ├── signup.ejs              // Signup page template
│   ├── resetPassword.ejs       // Reset password page template
│   ├── files/                  // File-related view templates
│   │   ├── upload.ejs          // File upload page template
│   │   ├── list.ejs            // List of files page template
│   │   ├── details.ejs         // File details page template
│   │   └── edit.ejs            // Edit file details page template
├── public/                     // Public static assets
│   ├── style.css               // CSS styles
│   └── scripts.js              // Client-side JavaScript
├── .env                        // Environment variables configuration
├── server.js                   // Main server file
├── package.json                // Node.js project configuration
└── README.md                   // Project documentation and instructions
