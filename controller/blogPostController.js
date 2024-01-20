const { BlogPost } = require("../models");

// Helper function for handling not found responses
const handleNotFound = (res, message = "Blog post not found") => {
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

// Controller function for creating a new blog post
const create = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new blog post
    const newPost = await BlogPost.create({
      title,
      content,
      userId: req.user.id, // Assuming you have the user information from authentication middleware
    });

    // Respond with the newly created blog post
    handleSuccess(res, newPost, 201);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for updating a blog post
const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    // Find the blog post by ID
    const post = await BlogPost.findByPk(postId);

    // Check if the blog post exists
    if (!post) {
      return handleNotFound(res);
    }

    // Check if the authenticated user is the author of the blog post
    if (post.userId !== req.user.id) {
      return handleUnauthorized(
        res,
        "You are not the author of this blog post"
      );
    }

    // Update the blog post
    await post.update({ title, content });

    // Respond with the updated blog post
    handleSuccess(res, post);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for deleting a blog post
const deleteBlog = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the blog post by ID
    const post = await BlogPost.findByPk(postId);

    // Check if the blog post exists
    if (!post) {
      return handleNotFound(res);
    }

    // Check if the authenticated user is the author of the blog post
    if (post.userId !== req.user.id) {
      return handleUnauthorized(
        res,
        "You are not the author of this blog post"
      );
    }

    // Delete the blog post
    await post.destroy();

    // Respond with a success message
    handleSuccess(res, { message: "Blog post deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for getting all blog posts
const getAll = async (req, res) => {
  try {
    // Get all blog posts
    const allPosts = await BlogPost.findAll();

    // Respond with the list of blog posts
    handleSuccess(res, allPosts);
  } catch (error) {
    handleServerError(res, error);
  }
};

// Controller function for getting a blog post by ID
const getById = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the blog post by ID
    const post = await BlogPost.findByPk(postId);

    // Check if the blog post exists
    if (!post) {
      return handleNotFound(res);
    }

    // Respond with the blog post
    handleSuccess(res, post);
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  create,
  update,
  deleteBlog,
  getAll,
  getById,
};
