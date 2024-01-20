const express = require("express");
const router = express.Router();
const commentController = require("../controller/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a new comment to a blog post (authentication required)
router.post(
  "/:blogPostId",
  authMiddleware.authenticate,
  commentController.create
);

// Update a comment (authentication required)
router.put("/:id", authMiddleware.authenticate, commentController.update);

// Delete a comment (authentication required)
router.delete(
  "/:id",
  authMiddleware.authenticate,
  commentController.deleteComment
);

// Get all comments for a specific blog post
router.get("/:blogPostId", commentController.getAllByBlogPost);

module.exports = router;
