const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateToken = (userId) => {
  return jwt.sign({ userId }, "your-secret-key", { expiresIn: "1h" });
};

//POST REGISTER USER
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username or email is already in use
    const [existingUser, existingEmail] = await Promise.all([
      User.findOne({ where: { username } }),
      User.findOne({ where: { email } }),
    ]);

    if (existingUser || existingEmail) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Generate a JWT for the newly registered user
    const token = generateToken(newUser.id);

    // Respond with the token and user information
    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//POST LOGIN USER
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is correct
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT for the authenticated user
    const token = generateToken(user.id);

    // Respond with the token and user information
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
};
