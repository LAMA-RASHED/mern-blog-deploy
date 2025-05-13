'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../config/dbConnection');
const { Schema, model } = mongoose;

const slugify = require('slugify');
const crypto = require('crypto');
const View = require('./view.model');
const Like = require('./postLike.model');
const Comment = require('./comment.model');

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Post Title is required'],
      trim: true,
      maxlength: [50, 'Post Title can not be more than 50 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add Post content'],
    },
    image: {
      type: String,
      default: 'default.png',
    },
    slug: String,
    published_date: Date,
    status: {
      type: String,
      default: 'published',
      enum: ['published', 'unpublished'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  // toJSON is used to convert this MongoDB document into JSON
  // virtuals true means during this process, virtuals will be added to the JSON format
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Define the proper virtual for comments with localField and foreignField
PostSchema.virtual('commentsList', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  justOne: false, // Set to false for getting an array
});

// Create a slug
PostSchema.pre('save', function (next) {
  const randomString = crypto.randomBytes(4).toString('hex');
  // slugify is a library to create slugs. It will replace any url unfriendly characters with hyphens
  let slug = `${slugify(this.title, { lower: true })}-${randomString}`;
  this.slug = slug;

  next();
});

// Add publish date automatically
PostSchema.pre('save', function (next) {
  // if status is published
  if (this.status === 'published') {
    this.published_date = new Date();
    // if status is unpublished, and is being updated now and if the new value is published
  } else if (this.isModified('published_date') && this.status === 'published') {
    this.published_date = new Date();
  }

  next();
});

// Define virtuals for comment_count, view_count, like_count, comments, has_liked, isowner
// Virtuals for calculated fields
// our frantend is developed in advance of the backend
// when we develop frontend we used variables without underscore
// our intent here replace _ variables into without underscore
PostSchema.virtual('comment_count').get(function () {
  // this._comment_count is a calculated field
  return this._comment_count || 0;
});

PostSchema.virtual('comments').get(function () {
  // Return from commentsList virtual if available, otherwise from cached value
  return this.commentsList || this._comments || [];
});

PostSchema.virtual('has_liked').get(function () {
  return this._has_liked || null;
});

PostSchema.virtual('isowner').get(function () {
  return this._isowner || null;
});

PostSchema.virtual('view_count').get(function () {
  return this._view_count || 0;
});

PostSchema.virtual('like_count').get(function () {
  return this._like_count || 0;
});

// Add virtuals for frontend compatibility
PostSchema.virtual('likes').get(function () {
  return this._likes || [];
});

PostSchema.virtual('views').get(function () {
  return this._view_count || 0;
});

PostSchema.virtual('isPublish').get(function () {
  return this.status === 'published';
});

PostSchema.virtual('userId').get(function () {
  return this.author;
});

PostSchema.virtual('categoryId').get(function () {
  return this.category;
});

PostSchema.virtual('countOfVisitors').get(function () {
  return this._view_count || 0;
});

// Virtual for `id` to alias `_id`
PostSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// for full image URL
// Create a reusable function to format the image URL
PostSchema.methods.formatImageUrl = function () {
  if (this.image) {
    if (!this.image.startsWith('http')) {
      const PORT = process.env.PORT || 5000;
      const HOST = process.env.HOST || '127.0.0.1';
      const serverUrl = `http://${HOST}:${PORT}`;
      this.image = `${serverUrl}/${this.image}`;
    }
  } else {
    // Set a default image
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '127.0.0.1';
    const serverUrl = `http://${HOST}:${PORT}`;
    this.image = `${serverUrl}/public/images/default.png`;
  }
};

// Method to calculate comment count and comments
PostSchema.methods.calculateFields = async function (userId) {
  // Format the image URL
  this.formatImageUrl();

  // We no longer need to fetch comments directly since we're using the commentsList virtual
  // Just set the comment count based on the commentsList length if available
  if (this.commentsList) {
    this._comment_count = this.commentsList.length || 0;
    this._comments = this.commentsList;
  } else {
    // For backward compatibility, still fetch comments if commentsList is not populated
    const comments = await Comment.find({ postId: this._id })
      .populate('userId', 'email username firstName lastName')
      .select('content createdAt');
    this._comments = comments;
    this._comment_count = comments.length || 0;
  }

  // fetch the likes
  const likes = await Like.find({ postId: this._id });
  this._like_count = likes.length || 0;
  // Store like userIds for frontend compatibility
  this._likes = likes.map((like) => like.userId.toString());

  // check if the user has liked the post
  this._has_liked = userId
    ? likes.some((like) => like.userId.toString() === userId.toString())
    : null;

  // check the user is the owner of the post
  this._isowner = userId ? this.author.toString() === userId.toString() : null;

  // fetch the views
  const views = await View.find({ postId: this._id });
  this._view_count = views.length || 0;
};

// Post query middleware to calculate fields after fetching the document
PostSchema.post('findOne', async function (doc) {
  // we need to access the current user
  // how we access the current user is by req.user
  // but we cannot access req.user in our model
  // we can receive extra information by using setOptions
  // to access these options we can use this.getOptions
  const userId = this.getOptions()?.userId;
  if (doc) {
    await doc.calculateFields(userId);
  }
});

PostSchema.post('find', async function (docs) {
  for (const doc of docs) {
    await doc.calculateFields();
  }
});

// console.log(PostSchema._comments)

module.exports = model('Post', PostSchema);
