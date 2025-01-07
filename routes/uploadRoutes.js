const express = require("express");
const router = express.Router();
const uploadImages = require("../middlewares/upload"); // Path to your upload.js middleware

// Define the upload route
router.post("/upload", async (req, res) => {
  try {
    const uploadedFiles = await uploadImages(req, "images"); // "images" is the key for uploaded files
    res.status(200).json({
      status: "success",
      message: "Files uploaded successfully",
      files: uploadedFiles, // URLs from S3
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "File upload failed",
      error: error.message,
    });
  }
});

module.exports = router;
