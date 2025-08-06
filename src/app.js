const express = require("express");
const app = express();
const authRoutes = require("./services/auth"); // Auth routes (no token required)

// Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
// Import Routes
const userRoutes = require("./services/userService");

const authentication = require("./middlewares/authMiddleware"); // Change here: Import authentication directly
let cors = require("cors");
app.use(cors());
app.use("/api", authRoutes); // These routes (login, register, forgot password) won't require authentication

// Apply the authentication middleware to all routes that require a token
app.use(authentication); // No need to invoke it as a function
app.use("/api/users", userRoutes); // User routes that require authentication

// Export app for server.js
module.exports = app;
