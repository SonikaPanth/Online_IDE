var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");
require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const verifyToken = require("../middleware/authmiddleware"); // Import middleware
const Project = require("../models/projectModel");

const ObjectId = mongoose.Types.ObjectId;


const secret = process.env.JWT_SECRET || "default_secret"; // Use environment variable for JWT secret

/* GET home page */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

/* ========================== SIGNUP ========================== */
router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  
  try {
    let emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let user = await userModel.create({ username, name, email, password: hash });

    return res.json({ success: true, message: "User created successfully", user });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== LOGIN ========================== */
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    let token = jwt.sign({ email: user.email, userId: user._id }, secret, { expiresIn: "1h" });

    return res.json({ success: true, message: "User logged in successfully", token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== GET USER DETAILS ========================== */
router.post("/getUserDetails", async (req, res) => {
  let { userId } = req.body;

  try {
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      return res.json({ success: true, message: "User details fetched successfully", user });
    } else {
      return res.json({ success: false, message: "User not found!" });
    }
  } catch (error) {
    console.error("Get User Details error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== CREATE PROJECT ========================== */
router.post("/createProject", async (req, res) => {
  let { userId, title } = req.body;

  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.create({ title, createdBy: userId });

    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  } catch (error) {
    console.error("Create Project error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== GET PROJECTS ========================== */
router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;

  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let projects = await projectModel.find({ createdBy: userId });

    return res.json({ success: true, message: "Projects fetched successfully", projects });
  } catch (error) {
    console.error("Get Projects error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== DELETE PROJECT ========================== */
router.post("/deleteProject", verifyToken, async (req, res) => {
  try {
    const { projId } = req.body;
    const userId = req.userId; // Extracted from JWT middleware

    console.log("🔍 Received projId:", projId);
    console.log("🔍 Authenticated userId:", userId);

    if (!projId) {
      return res.status(400).json({ success: false, message: "Project ID is required" });
    }

    const project = await Project.findOne({ _id: projId, createdBy: userId });
    
    console.log("🔍 Found Project:", project);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or does not belong to user" });
    }

    await Project.deleteOne({ _id: projId });
    return res.status(200).json({ success: true, message: "Project deleted successfully" });

  } catch (error) {
    console.error("❌ Delete Project error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




/* ========================== GET SINGLE PROJECT ========================== */
router.post("/getProject", async (req, res) => {
  let { userId, projId } = req.body;

  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.findOne({ _id: projId });

    if (project) {
      return res.json({ success: true, message: "Project fetched successfully", project });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } catch (error) {
    console.error("Get Project error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/* ========================== UPDATE PROJECT ========================== */
router.post("/updateProject", async (req, res) => {
  let { userId, htmlCode, cssCode, jsCode, projId } = req.body;

  try {
    let user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode, cssCode, jsCode },
      { new: true }
    );

    if (project) {
      return res.json({ success: true, message: "Project updated successfully", project });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } catch (error) {
    console.error("Update Project error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
