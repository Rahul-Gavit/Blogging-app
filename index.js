const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const dbConfig = require("./connection/database");
const authRoutes = require("./routes/authRoutes");
const blogPostRoutes = require("./routes/blogPostsRoutes");
const commentRoutes = require("./routes/commentsRoutes");

const app = express();
app.use(bodyParser.json());

dbConfig
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing database:", error);
  });

// Set up your routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog-posts", blogPostRoutes);
app.use("/api/v1/comments", commentRoutes);

// Set up a default route
app.get("/", (req, res) => {
  res.send("Welcome to your Blogging Platform API!");
});

// Set up a global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
