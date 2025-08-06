const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: {
          message: "User not found.",
        },
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        data: {
          message: "Invalid email or password.",
        },
      });
    }

    const { _id, fullName, role } = user;
    const payload = { _id, email, fullName, role };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    return res.status(200).json({ user: payload, token });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      fullname,
      password,
      role = "CUSTOMER", // default role is 'customer'
    } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return {
        status: "fail",
        data: {
          message: "Email đã tồn tại",
        },
      };
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      fullName: fullname,
      email: email,
      password: hashed, // Use the hashed password
      role: role,
    });

    const userCreate = await user.save();
    if (userCreate) {
      return res.status(200).json(userCreate);
    } else {
      return res.status(400).json(userCreate);
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

module.exports = router;
