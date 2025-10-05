const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Board = require("../models/Board");
const User = require("../models/user");
const List = require("../models/List")

router.get("/boards", async (req, res) => {
    try {
        const boards = await Board.find();
        res.json({
            status: "success",
            data: boards
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/boards/:boardId/users", async (req, res) => {
    try {
        const boardId = req.params.boardId;

        // Lấy board + populate members
        const board = await Board.findById(boardId).populate("members", "fullName email");

        if (!board) {
            return res.status(404).json({ status: "error", message: "Board not found" });
        }

        // Lấy tất cả task trong board (populate assignees)
        const tasks = await Task.find({ board: boardId }).populate("assignees", "fullName email");;

        // Tạo thống kê cho từng member
        const userStats = board.members.map(member => {
            const user = member; // vì members: [{ user: ObjectId }]
            const userTasks = tasks.filter(task =>
                task.assignees.some(a => a._id.toString() === user._id.toString())
            );
            console.log(userTasks);
            const totalTasks = userTasks.length;
            const completedTasks = userTasks.filter(t => t.status === "complete").length;
            const inProgressTasks = userTasks.filter(t => t.status === "progress").length;
            const todoTasks = userTasks.filter(t => t.status === "todo").length;
            const overdueTasks = userTasks.filter(t =>
                t.dueDate && t.dueDate < new Date() && t.status !== "complete"
            ).length;

            return {
                userId: user._id,
                userName: user.fullName,
                userEmail: user.email,
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                overdueTasks,
                completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
            };
        });

        res.json({
            status: "success",
            data: userStats
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});



router.get("/boards/:boardId", async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const tasks = await Task.find({ board: boardId });
        console.log(tasks);

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "complete").length;
        const inProgressTasks = tasks.filter(t => t.status === "progress").length;
        const todoTasks = tasks.filter(t => t.status === "todo").length;

        res.json({
            status: "success",
            data: {
                totalTasks,
                completedTasks,
                inProgressTasks,
                todoTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const tasks = await Task.find({ assignees: userId });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === "complete").length;
        const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < new Date() && t.list.title !== "complete").length;

        res.json({
            status: "success",
            data: {
                totalTasks,
                completedTasks,
                overdueTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/overview", async (req, res) => {
    try {
        const [totalBoards, totalTasks] = await Promise.all([
            Board.countDocuments(),
            Task.countDocuments()
        ]);

        const completedTasks = await Task.countDocuments({ status: "complete" });

        res.json({
            status: "success",
            data: {
                totalBoards,
                totalTasks,
                completedTasks,
                completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;