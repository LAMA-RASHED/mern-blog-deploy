const Model = require('../models/post.model');
const View = require('../models/view.model');
const Like = require('../models/postLike.model');
const Comment = require('../models/comment.model');
const Category = require('../models/category.model');
const { uploadFile, deleteFile } = require('../utils/s3');

// @URL     GET /api/posts
exports.list = async (req, res) => {
  res.status(200).json(res.results);
};

// @URL     GET /api/posts/:id
exports.read = async (req, res) => {
  // add a view record
  // check whether the user has already viewed the post
  const view = await View.findOne({
    userId: req.user._id,
    postId: req.params.id,
  });
  // if the user has not viewed the post, create a new view
  if (!view) {
    await View.create({ userId: req.user._id, postId: req.params.id });
  }
  // this will add a new view all the time even if the user has already viewed the post
  // await View.create({ userId: req.user._id, postId: req.params.id });
  // we have auto calculated fields in the model. But it requires to know the current user
  // to pass the current user we have 2 options
  // option 1: call the calculateFields method manually by providing the user
  // const data = await Model.findById(req.params.id);
  // data.calculateFields(req.user._id);

  // option 2: when calling the model provide extra information about the user
  const data = await Model.findById(req.params.id)
    .populate('author')
    .populate('category');
  // now we can access the userId in the model

  res.status(200).json({ success: true, data });
};

// @URL     POST /api/posts
// exports.create = async (req, res) => {
//   // add the loggedin user info as the author of the post
//   req.body.author = req.user._id;
//   const category = await Category.findById(req.body.categoryId);
//   req.body.category = category?._id;

//   // add the image to the req.body
//   if (req?.file) req.body.image = req.file.path;
//   console.log(req.body.image);

//   const data = await Model.create(req.body);
//   console.log({ data, req: req.body });
//   res.status(201).json({ success: true, data });
// };
exports.create = async (req, res) => {
  req.body.author = req.user._id;

  const category = await Category.findById(req.body.categoryId);
  req.body.category = category?._id;

  // Upload image to S3 and save URL
  if (req?.file) {
    const imageUrl = await uploadFile(req.file);
    req.body.image = imageUrl;
  }

  const data = await Model.create(req.body);
  res.status(201).json({ success: true, data });
};

// @URL     PUT /api/posts/:id
// exports.update = async (req, res) => {
//   // add the image to the req.body
//   // req.file.path has the full path of the image
//   if (req?.file) req.body.image = req.file.path;
//   console.log(req.body.image);

//   const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({ success: true, data });
// };
exports.update = async (req, res) => {
  const existing = await Model.findById(req.params.id);

  // Upload new image if provided
  if (req?.file) {
    // Optionally delete the old image from S3 (if you store key separately)
    // const oldKey = existing.image?.split('/').slice(-2).join('/'); // extract key if using full URL
    // if (oldKey) await deleteFile(oldKey);

    const imageUrl = await uploadFile(req.file);
    req.body.image = imageUrl;
  }

  const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data });
};


// @URL     DELETE /api/posts/:id
exports.delete = async (req, res) => {
  const data = await Model.findById(req.params.id);
  await data.deleteOne();
  res.status(204).json({ success: true, data: {} });
};
