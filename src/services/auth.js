const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

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

    return res.status(200).json({ status: "sucess", user: payload, token });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
      details: { errorCode: 500, error: error.message },
    });
  }
});

router.post("/login-google", async (req, res) => {
  try {
    const cilent = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await cilent.verifyIdToken({
      idToken: req.body.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        fullName: payload.name,
        password: "123456",
        role: "Member",
      });
      await user.save();
    }
    const { _id, fullName, role } = user;
    const payload1 = { _id, email: payload.email, fullName, role };
    const token = jwt.sign(payload1, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });
    return res.status(200).json({ status: "sucess", user: payload1, token });
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
      role = "Member", // default role is 'customer'
    } = req.body;
    console.log(email);

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        data: {
          message: "Email đã tồn tại",
        },
      });
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
      return res.status(200).json({
        status: "success",
        data: userCreate,
      });
    } else {
      return res.status(400).json({
        status: "fail",
        data: {
          message: "Đăng ký thất bại",
        },
      });
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
