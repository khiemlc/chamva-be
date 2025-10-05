const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authentication = require("../middlewares/authMiddleware");




router.get("/admin/all-user", async (req, res) => {
  try {
    const users = await User.find({
      role: "Member"
    })
    return res.status(200).json({
      status: "success",
      data: users
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
})


router.get("/admin/all-user1", authentication, async (req, res) => {
  try {
    const currentUserId = req.user._id; // id user hiện tại từ token/middleware

    const users = await User.find({ _id: { $ne: currentUserId } }); // $ne = not equal
    return res.status(200).json({
      status: "success",
      data: users
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
})

router.get("/profile", authentication, async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: { message: "User not found." },
      });
    }
    return res.status(200).json({
      status: "success",
      data: { message: "User retrieved successfully.", result: user },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id
    console.log(req.body.role);

    const role = req.body.role;
    const userOld = await User.findById(id);
    if (!userOld) {
      return res.status(404).json({
        status: "fail",
        data: { message: "User not found!" },
      });
    }
    const userNew = await User.findByIdAndUpdate(
      id,
      {
        role
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: { message: "Update user.", result: userNew },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: { message: "User not found." },
      });
    }
    return res.status(200).json({
      status: "success",
      data: { message: "User retrieved successfully.", result: user },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});




// Cập nhật hàm getAllUsers để filter theo role, status
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;

    const whereClause = {};

    if (role) {
      whereClause.role = role;
    }

    const users = await User.find(whereClause);
    return res.status(200).json({
      status: "success",
      data: { message: "Users retrieved successfully.", result: users },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: { message: "User not found." },
      });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      data: { message: "User deleted successfully." },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

module.exports = router;
