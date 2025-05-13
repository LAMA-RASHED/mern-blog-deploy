const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * Upload a file to AWS S3
 * @param {Object} file - The file object from multer
 * @param {string} folder - Optional folder path within the bucket
 * @returns {Promise<Object>} - S3 upload result
 */
const uploadToS3 = async (file, folder = '') => {
  try {
    // Generate file path
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    // Prepare upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer || fs.createReadStream(file.path),
      ContentType: file.mimetype,
      ACL: 'public-read', // Make file publicly accessible
    };

    // Upload to S3
    const result = await s3.upload(params).promise();

    console.log('File uploaded successfully:', result.Location);

    return {
      success: true,
      url: result.Location,
      key: result.Key,
      fileName,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete a file from AWS S3
 * @param {string} key - The S3 object key
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();

    return {
      success: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
