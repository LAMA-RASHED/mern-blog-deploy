const Model = require('../models/category.model');

// @URL     GET /api/categories
exports.list = async (req, res) => {
  try {
    const categories = await Model.find();

    // Return in the format expected by the frontend
    res.status(200).json({
      error: '',
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @URL     GET /api/categories/:id
exports.read = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @URL     POST /api/categories
exports.create = async (req, res) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
// @URL     PUT /api/categories/:id
exports.update = async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(202).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @URL     DELETE /api/categories/:id
exports.delete = async (req, res) => {
  try {
    const data = await Model.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
