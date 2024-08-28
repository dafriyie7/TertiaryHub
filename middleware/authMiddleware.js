/**
 * Middleware to ensure the user is authenticated.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const Authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route
  }
  res.redirect('/auth/login'); // Redirect to login page if not authenticated
};

/**
 * Middleware to ensure the user is authenticated and an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next(); // User is authenticated and is an admin, proceed to the next middleware/route
  }
  res.redirect('/'); // Redirect to the home page if not an admin
};

module.exports = { Authenticated, isAdmin };