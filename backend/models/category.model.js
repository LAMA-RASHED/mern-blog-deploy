"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../config/dbConnection')

const CategorySchema = new mongoose.Schema({

    name: {
        type:String, 
        trim:true, 
        unique: true,
        required: [true, 'Category name is required']
    }

}, {timestamps: true, collection: 'categories'})

module.exports = mongoose.model('Category', CategorySchema)