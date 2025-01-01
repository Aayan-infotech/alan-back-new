const path = require("path");
const fs = require("fs");

const uploadImages = async (req, key = "images") => {
  if (!req.files || !req.files[key]) {
    throw new Error("No files uploaded");
  }

  const images = req.files[key];
  const imagePaths = [];
  const uploadDir = path.join(__dirname, "../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Handle single or multiple image uploads
  if (Array.isArray(images)) {
    for (const image of images) {
      const imagePath = path.join(uploadDir, `${Date.now()}-${image.name}`);
      await image.mv(imagePath); // Save image to the server
      imagePaths.push(`${req.protocol}://${req.get("host")}/uploads/${path.basename(imagePath)}`);
    }
  } else {
    const imagePath = path.join(uploadDir, `${Date.now()}-${images.name}`);
    await images.mv(imagePath); // Save image to the server
    imagePaths.push(`${req.protocol}://${req.get("host")}/uploads/${path.basename(imagePath)}`);
  }

  return imagePaths;
};

module.exports = uploadImages;