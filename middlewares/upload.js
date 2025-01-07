const AWS = require("aws-sdk");
require("dotenv").config(); 

const uploadImages = async (req, key = "images") => {
  if (!req.files || !req.files[key]) {
    throw new Error("No files uploaded");
  }

  const images = req.files[key];
  const imageUrls = [];

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const getContentType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      case 'bmp':
        return 'image/bmp';
      default:
        return 'application/octet-stream'; // default for unknown file types
    }
  };

  if (Array.isArray(images)) {
    for (const image of images) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${Date.now()}-${image.name}`,
        Body: image.data,
        ContentType: getContentType(image.name),  // Dynamically set content type
      };

      const data = await s3.upload(params).promise();
      imageUrls.push(data.Location);  // S3 URL
    }
  } else {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}-${images.name}`,
      Body: images.data,
      ContentType: getContentType(images.name),  // Dynamically set content type
    };

    const data = await s3.upload(params).promise();
    imageUrls.push(data.Location);
  }

  return imageUrls; 
};

module.exports = uploadImages;

