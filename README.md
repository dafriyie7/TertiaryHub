# DocServe

A platform designed to streamline file management and sharing.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Features](#features)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)

## Description

**Website Link:** [DocServe](https://docserve.onrender.com)

DocServe is a platform designed to streamline file management and sharing. This platform caters to both regular users and administrators, providing a comprehensive set of features to ensure efficient document handling and secure access.

**Made using the MEEN stack:**

- MongoDB
- Express.js
- EJS
- Node.js

## Installation

### Prerequisites

- MongoDB and Mongo URL
- Email account
- Dropbox SDK

Clone Repository

`git clone https://github.com/dafriyie7/DocServe.git && cd DocServe`

To install dependencies, run:

    npm install

Setup '.env' file

    PORT = 5000
    MONGO_URL = your_mongo_url
    SESSION_SECRET = your_session_secret
    EMAIL_USER = your_email
    EMAIL_PASS = your_email_password
    DROPBOX_ACCESS_TOKEN = your_dropbox_access_token

Run the application or start server

    run dev

## FEATURES

1. User Authentication
Features:

    Signup with email verification.
    Login with email and password.
    Reset password feature.
2. User Dashboard and File Feed
Features:

    Display a feed of downloadable files.
    Allow users to search the file server.
    Admins can upload, download and delete files
3. Email Functionality
Features:

    Allow users to send files to an email through the platform.

## FILE STRUCTURE

- /config/
  - db.js
  - dropbox.js
  - multer.js
  - passport.js
- /controllers/
  - authController.js
  - fileController.js
- /er-diagram/
  - ER-DIAGRAM.drawio
- /middleware/
  - authMiddleware.js
  - errorMiddleware.js
- /models/
  - fileModel.js
  - UserModel.js
- /node_modules/
  - // node-files
- /public/
  - style.css
  - styles.css
- /routes/
  - authRoutes.js
  - fileRoutes.js
- /views/
  - dashboard.ejs
  - forgot-password.ejs
  - login.ejs
  - reset-password.ejs
  - signup.ejs
- .env
- .gitignore
- package-lock.json
- package.json
- README.md
- server.js

## TECHNOLOGIES USED

    Node.js
    Express.js
    Mongoose
    Passport.js
    bcryptjs
    Multer
    Dropbox SDK
    express-session
    connect-mongo
    dotenv
    uuid
    got
    method-override
    nodemailer
    EJS
    connect-flash
    cors
    nodemon
