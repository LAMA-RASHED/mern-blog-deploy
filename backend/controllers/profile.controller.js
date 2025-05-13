const Model = require('../models/profile.model');
const ErrorResponse = require('../utils/ErrorResponse');

// @URL     GET /api/profile/:id
exports.read = async (req, res) => {
  const data = await Model.findById(req.params.id).populate('userId');
  res.status(200).json({ success: true, data });
};

// @URL     POST /api/profile
exports.create = async (req, res) => {
  // Check if the user has a profile
  const profile = await Model.findOne({
    userId: req.user._id,
  });
  if (profile) throw new ErrorResponse(403, 'Already has a profile');

  // Add the loggedin user info
  req.body.userId = req.user._id;
  // add the image to the req.body
  if (req?.file) req.body.image = req.file.path;
  console.log(req.body.image);

  const data = await Model.create(req.body);
  res.status(201).json({ success: true, data });
};
// @URL     PUT /api/profile/:id
exports.update = async (req, res) => {
  // add the image to the req.body
  if (req?.file) req.body.image = req.file.path;
  console.log(req.body.image);

  const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(202).json({ success: true, data });
};

// @URL     DELETE /api/profile/:id
exports.delete = async (req, res) => {
  const data = await Model.findById(req.params.id);
  console.log(req.params.id);
  await data.deleteOne();
  res.status(204).json({ success: true, data: {} });
};
