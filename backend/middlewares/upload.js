// const multer = require('multer');

// module.exports = multer({
//   storage: multer.diskStorage({
//     destination: './public/images',
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   }),
// });

// middlewares/upload.js

const multer = require("multer");

const storage = multer.memoryStorage(); // 👈 stores file in memory buffer

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: limit file size to 5MB
});

module.exports = upload;
