const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the request header
    const token = req.header("Authorization");

    // Check if the token is missing
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    // Verify the token
    const decoded = jwt.verify(token, "your-secret-key");

    // Attach the user information to the request for further use
    req.user = await User.findByPk(decoded.userId);

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = {
  authenticate,
};
