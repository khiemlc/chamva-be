const express = require("express");
const app = express();

// Middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
// Import Routes
const authRoutes = require("./services/auth"); // Auth routes (no token required)
const userRoutes = require("./services/userService");
const boardRoutes = require("./services/board");
const taskRoutes = require("./services/task");
const commentRoutes = require("./services/comment");
// const notificationRoutes = require("./services/notificationService");
const reportRoutes = require("./services/report");
const authentication = require("./middlewares/authMiddleware"); // Change here: Import authentication directly
let cors = require("cors");
app.use(cors());
app.use("/api/auth", authRoutes);
// app.use(authentication); // No need to invoke it as a function
app.use("/api/users", userRoutes); // User routes that require authentication
app.use("/api/boards", boardRoutes); // Order routes that require authentication
app.use("/api/tasks", taskRoutes); // User routes that require authentication
app.use("/api/comments", commentRoutes); // User routes that require authentication
// app.use("/api/notifications", notificationRoutes); // User routes that require authentication
app.use("/api/reports", reportRoutes); // User routes that require authentication
// Export app for server.js
module.exports = app;
