const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Registration and login routes (no need for authentication)
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
