// routes/task.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Board = require("../models/Board");
const authentication = require("../middlewares/authMiddleware");
const { uploadMixed } = require("../config/cloudinary");
const { broadcastMessage } = require("../websocket");

// CREATE TASK
router.post("/create", uploadMixed.array("attachments", 10), async (req, res) => {
  try {
    const { title, description, boardId, assignees, checklist, dueDate, order } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!boardId) return res.status(400).json({ message: "BoardId is required" });

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    // Tìm order lớn nhất trong board rồi +1 (auto sort)
    const maxOrderTask = await Task.findOne({ board: board._id }).sort("-order");
    const nextOrder = order !== undefined ? order : (maxOrderTask ? maxOrderTask.order + 1 : 0);

    // Handle attachments (nếu có file upload)
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        url: file.path, // link Cloudinary
        name: file.originalname,
        type: file.fileType
      }));
    }

    let newTask = new Task({
      title, description, board: board._id, assignees, checklist, attachments, dueDate, order: nextOrder
    });

    await newTask.save();
    newTask = await Task.findById(newTask._id)
      .populate("assignees", "fullName email");
    res.status(201).json({
      status: "success",
      message: "Task created successfully",
      data: newTask
    });
    if (req.app.wss) {
      broadcastMessage(req.app.wss, "TASK_CREATED", newTask);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET TASKS BY BOARD
router.get("/boards/:boardId/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .sort({ order: 1 })
      .populate("assignees", "fullName email");

    res.json({
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/boards/:boardId/my-tasks", authentication, async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId, assignees: req.user._id })
      .sort({ order: 1 })
      .populate("assignees", "fullName email");

    res.json({
      status: "success",
      message: "Tasks fetched successfully",
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET TASK BY ID
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignees", "fullName email")
      .populate("board", "name");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({
      status: "success",
      message: "Task fetched successfully",
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("assignees", "fullName email");

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MOVE TASK (chỉ cần cập nhật board + order)
// Cập nhật trạng thái và order task
router.put("/:id/move", async (req, res) => {
  try {
    const { status, newOrder } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (status) task.status = status;

    // Nếu muốn reorder trong cùng board
    if (newOrder !== undefined) {
      const maxOrderTask = await Task.findOne({ board: task.board }).sort("-order");
      task.order = newOrder !== null ? newOrder : (maxOrderTask ? maxOrderTask.order + 1 : 0);
    }

    await task.save();
    task = await Task.findById(task._id)
      .populate("assignees", "fullName email");
    res.json({
      status: "success",
      message: "Task updated successfully",
      data: task
    });
    if (req.app.wss) {
      broadcastMessage(req.app.wss, "TASK_UPDATED", task);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE TASK
router.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    res.json({
      status: "success",
      message: "Task deleted successfully",
      data: deletedTask
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
