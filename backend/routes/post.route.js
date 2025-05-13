const router = require('express').Router();
const ctrl = require('../controllers/post.controller');
const { protect, isAdminOrOwner } = require('../middlewares/permissions');
const query = require('../middlewares/query');
const Post = require('../models/post.model');
const upload = require('../middlewares/upload');

router
  .route('/')
  .get(query(Post, 'author category'), ctrl.list)
  // to add a new post we need to protect the route
  // a post may have an image and to upload the image we need to user our multer middleware
  // multer will upload the image to the public/images folder as we defined in the multer middleware
  // multer will add req.file.originalname as the location of the image
  // now after that process completed we can create the post
  .post(protect, upload.single('image'), ctrl.create);

router
  .route('/:id')
  .get(protect, ctrl.read)
  .put(
    protect,
    isAdminOrOwner(Post, 'author'),
    upload.single('image'),
    ctrl.update
  )
  .delete(protect, isAdminOrOwner(Post, 'author'), ctrl.delete);

module.exports = router;
