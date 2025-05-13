const Model = require('../models/comment.model');
const Post = require('../models/post.model');

// @URL     GET /api/comments
exports.list = async (req, res) => {
  res.status(200).json(res.results);
};

// @URL     GET /api/comments/:id
exports.read = async (req, res) => {
  const data = await Model.findById(req.params.id);
  res.status(200).json({ success: true, data });
};

// @URL     POST /api/comments
exports.create = async (req, res) => {
  req.body.userId = req.user._id;
  const data = await Model.create(req.body);
  res.status(201).json({ success: true, data });
};
// @URL     PUT /api/comments/:id
exports.update = async (req, res) => {
  const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(202).json({ success: true, data });
};

// @URL     DELETE /api/comments/:id
exports.delete = async (req, res) => {
  const data = await Model.findById(req.params.id);
  await data.deleteOne();
  res.status(204).json({ success: true, data: {} });
};

// @url     GET /api/comments/:postId/post
exports.getPostComments = async (req, res) => {
  const comments = await Model.find({ postId: req.params.postId });
  const post = await Post.findById(req.params.postId);
  res.status(200).json({ success: true, post, comments });
};
