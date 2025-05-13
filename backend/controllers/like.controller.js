const Model = require('../models/postLike.model');
const Post = require('../models/post.model');
const ErrorResponse = require('../utils/ErrorResponse');

// @URL     POST /api/like
exports.postLike = async (req, res) => {
  // alternative aproach we can use slug fields to get the post instead of the id
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) throw new ErrorResponse(404, 'Post not found');
  // check if the user has already liked the post
  // const liked = await Model.findOne({ userId: req.user._id, postId: post._id });
  // if (liked) liked.remove();
  const liked = await Model.findOneAndDelete({
    userId: req.user._id,
    postId: post._id,
  });
  if (liked) {
    res.status(200).json({ success: true, message: 'Post unliked' });
  } else {
    // the user has not liked the post and we need to create a new like
    const data = await Model.create({ userId: req.user._id, postId: post._id });
    res.status(200).json({ success: true, data, message: 'Post liked' });
  }
};

// @URL     DELETE /api/like/:id
exports.remove = async (req, res) => {
  const data = await Model.findByIdAndDelete(req.params.id);
  res.status(204).json({ success: true, data });
};

// @url     GET /api/like/:postId/post
exports.getPostLikes = async (req, res) => {
  const likes = await Model.find({ postId: req.params.postId });
  const post = await Post.findById(req.params.postId);
  res.status(200).json({ success: true, post, likes, count: likes.length });
};
