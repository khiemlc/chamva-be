const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const authentication = require("../middlewares/authMiddleware");
const { uploadMixed } = require("../config/cloudinary");
router.post(
    "/create/:taskId",
    authentication,
    uploadMixed.array("attachments", 10), // tối đa 10 file
    async (req, res) => {
        try {
            const { content, mentions } = req.body;
            const taskId = req.params.taskId;
            const authorId = req.user._id;

            const attachments = req.files.map(file => ({
                url: file.path,
                type: file.mimetype.startsWith("image/") ? "image" : "document",
                name: file.originalname
            }));

            let comment = new Comment({
                content,
                mentions,
                attachments, // [{url, type, name}]
                task: taskId,
                author: authorId,
            });

            await comment.save();
            comment = await Comment.findById(comment._id)
                .populate("author", "fullName");
            res.status(201).json({
                status: "success",
                message: "Comment created successfully",
                data: comment,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    }
);

router.get("/:taskId", authentication, async (req, res) => {
    const taskId = req.params.taskId;
    const comments = await Comment.find({ task: taskId }).populate("author", "fullName");
    res.status(201).json({
        status: "success",
        message: "Get comments successfully",
        data: comments
    })
})
module.exports = router;
