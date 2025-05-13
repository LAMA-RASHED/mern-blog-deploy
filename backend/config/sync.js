'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// sync():

module.exports = async function () {
  // return null;

  /* REMOVE DATABASE */
  const { mongoose } = require('./dbConnection');
  // await mongoose.connection.dropDatabase();
  // console.log('- Database and all data DELETED!');
  /* REMOVE DATABASE */

  /* Category */
  const Category = require('../models/category.model');
  await Category.deleteMany(); // !!! Clear collection.
  await Category.create({
    _id: '65343222b67e9681f937f201',
    name: 'Food',
  });
  await Category.create({
    _id: '65343222b67e9681f937f202',
    name: 'Entertainment',
  });
  await Category.create({
    _id: '65343222b67e9681f937f203',
    name: 'Life Style',
  });
  await Category.create({
    _id: '65343222b67e9681f937f204',
    name: 'Travel',
  });
  await Category.create({
    _id: '65343222b67e9681f937f205',
    name: 'Technology',
  });
  await Category.create({
    _id: '65343222b67e9681f937f206',
    name: 'Health',
  });
  await Category.create({
    _id: '65343222b67e9681f937f207',
    name: 'Business',
  });
  await Category.create({
    _id: '65343222b67e9681f937f208',
    name: 'Education',
  });
  await Category.create({
    _id: '65343222b67e9681f937f209',
    name: 'Science',
  });
  await Category.create({
    _id: '65343222b67e9681f937f20a',
    name: 'Art',
  });
  await Category.create({
    _id: '65343222b67e9681f937f20b',
    name: 'Music',
  });
  await Category.create({
    _id: '65343222b67e9681f937f20c',
    name: 'Fashion',
  });

  /* Finished */
  console.log('* Synchronized.');
};
