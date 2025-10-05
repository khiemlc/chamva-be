const express = require("express");
const Board = require("../models/Board");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const authentication = require("../middlewares/authMiddleware");
router.post("/create", authentication, async (req, res) => {
    const user = req.user._id;
    const { name, description, members } = req.body;
    const membersObjectId = members.map(m => new mongoose.Types.ObjectId(m));

    const board = new Board({ name, description, members: membersObjectId, createdBy: user });

    await board.save();
    return res.status(200).json({
        status: "success",
        message: "Board created successfully",
        data: board
    })
});

router.get("/", async (req, res) => {
    try {
        // Có thể filter theo user nếu truyền userId
        const { userId } = req.query;

        let boards;
        if (userId) {
            boards = await Board.find({ members: userId }).populate("members", "fullName email");
        } else {
            boards = await Board.find().populate("members", "fullName email");
        }

        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/my-boards", authentication, async (req, res) => {
    try {
        const user = req.user._id;
        console.log(user);
        
        let boards;
        boards = await Board.find({ members: user });
        res.json({
            status: "success",
            data: boards
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error.",
            details: { errorCode: 500, error: error.message },
        });
    }
});



router.get("/manager", authentication, async (req, res) => {
    try {
        const user = req.user._id;
        let boards;
        boards = await Board.find({ createdBy: user }).populate("members", "fullName email");
        res.json({
            status: "success",
            data: boards
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error.",
            details: { errorCode: 500, error: error.message },
        });
    }
});

router.get("/boards/:id", async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate("members", "fullName email");
        if (!board) return res.status(404).json({ message: "Board not found" });

        res.json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/boards/:id", async (req, res) => {
    try {
        const { name, description, members } = req.body;

        const updatedBoard = await Board.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, members } },
            { new: true }
        ).populate("members", "fullName email");

        if (!updatedBoard) return res.status(404).json({ message: "Board not found" });
        res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/boards/:id", async (req, res) => {
    try {
        const deletedBoard = await Board.findByIdAndDelete(req.params.id);
        if (!deletedBoard) return res.status(404).json({ message: "Board not found" });

        res.json({ message: "Board deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;