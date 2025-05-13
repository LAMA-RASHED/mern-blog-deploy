"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../config/dbConnection')
const { Schema, model } = mongoose

const ViewSchema = new Schema({

userId: {
    type: Schema.Types.ObjectId, 
    ref:'User', 
    required: true
}, 
postId: {
    type: Schema.Types.ObjectId, 
    ref:'Post', 
    required: true
}


}, {timestamps: true})

module.exports = model('View', ViewSchema)