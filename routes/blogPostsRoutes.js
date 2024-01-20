const express = require("express");
const router = express.Router();
const blogPostController = require("../controller/blogPostController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new blog post (authentication required)
router.post("/", authMiddleware.authenticate, blogPostController.create);

// Update a blog post (authentication required)
router.put("/:id", authMiddleware.authenticate, blogPostController.update);

// Delete a blog post (authentication required)
router.delete(
  "/:id",
  authMiddleware.authenticate,
  blogPostController.deleteBlog
);

// Get all blog posts
router.get("/", blogPostController.getAll);

// Get a specific blog post by ID
router.get("/:id", blogPostController.getById);

module.exports = router;
