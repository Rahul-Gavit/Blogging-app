const { Comment, BlogPost } = require("../models");

// Helper function for handling not found responses
const handleNotFound = (res, message = "Not found") => {
  return res.status(404).json({ message });
};

// Helper function for handling unauthorized responses
const handleUnauthorized = (res, message = "Unauthorized") => {
  return res.status(403).json({ message });
};

// Helper function for handling success responses
const handleSuccess = (res, data, status = 200) => {
  return res.status(status).json(data);
};

// Helper function for handling server errors
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Controller function for creating a new comment
const create = async (req, res) => {
  try {
    const { content } = req.body;
    const blogPostId = req.params.blogPostId;

    // Check if the blog post exists
    const blogPost = await BlogPost.findByPk(blogPostId);
    if (!blogPost) {
      return handleNotFound(res, "Blog post not found");
    }

    // Add a new comment to the blog post
    const newComment = await Comment.create({
      content,
      userId: req.user.id,
      blogPostId,
    });

    // Respond with the newly created comment
    handleSuccess(res, newComment, 201);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for updating a comment
const update = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;

    // Find the comment by ID
    const comment = await Comment.findByPk(commentId);

    // Check if the comment exists
    if (!comment) {
      return handleNotFound(res, "Comment not found");
    }

    // Check if the authenticated user is the author of the comment
    if (comment.userId !== req.user.id) {
      return handleUnauthorized(res, "You are not the author of this comment");
    }

    // Update the comment
    await comment.update({ content });

    // Respond with the updated comment
    handleSuccess(res, comment);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for deleting a comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    // Find the comment by ID
    const comment = await Comment.findByPk(commentId);

    // Check if the comment exists
    if (!comment) {
      return handleNotFound(res, "Comment not found");
    }

    // Check if the authenticated user is the author of the comment
    if (comment.userId !== req.user.id) {
      return handleUnauthorized(res, "You are not the author of this comment");
    }

    // Delete the comment
    await comment.destroy();

    // Respond with a success message
    handleSuccess(res, { message: "Comment deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for getting all comments for a blog post
const getAllByBlogPost = async (req, res) => {
  try {
    const blogPostId = req.params.blogPostId;

    // Check if the blog post exists
    const blogPost = await BlogPost.findByPk(blogPostId);
    if (!blogPost) {
      return handleNotFound(res, "Blog post not found");
    }

    // Get all comments for the specified blog post
    const comments = await Comment.findAll({ where: { blogPostId } });

    // Respond with the list of comments
    handleSuccess(res, comments);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  create,
  update,
  deleteComment,
  getAllByBlogPost,
};
