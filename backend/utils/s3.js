// utils/s3.js
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFile = async (file) => {
  try {
    const key = `uploads/${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    await s3.upload(params).promise();
    return `${process.env.MEDIA_BASE_URL}/${key}`;
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw new Error("Image upload to S3 failed.");
  }
};

const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  await s3.deleteObject(params).promise();
};

module.exports = { uploadFile, deleteFile };
