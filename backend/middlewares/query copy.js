const query = (model, populate) => async (req, res, next) => {
  // Search/Filter functionality
  // url:5000?search[first_name]=value&search[last_name]=value2
  const search = req.query.search || {};
  for (let key in search) {
    search[key] = { $regex: search[key], $options: 'i' }; //i:case Insensitive
  }

  let query = model.find(search);
  // Select - filtering
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  } else {
    // Default
    query = query.sort('+createdAt');
  }
  // Pagination
  // url:5000/api/posts/page=2&limit=5
  const page = parseInt(req.query.page) || 1;
  const limit =
    parseInt(req.query.limit) || process.env.DEFAULT_PAGINATION || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(endIndex);
  const pagination = { page, limit };
  if (endIndex < total) pagination.next = { page: page + 1, limit };
  if (startIndex > 0) pagination.prev = { page: page - 1, limit };

  if (populate && !req.query.select) query = query.populate(populate);
  // Execute the query and fetch data from database;
  const results = await query;
  res.results = {
    success: true,
    count: total,
    results,
    pagination,
  };

  next();
};

module.exports = query;
