"use strict"
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
const { mongoose } = require('../config/dbConnection')
const { Schema, model } = mongoose

const ProfileSchema = new Schema({

    image: {
        type:String, 
        default:'default.png'
    }, 
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User', 
        required:true,
    }, 
    address:{
        type:String, 
        required: true, 
    }

}, {timestamps: true})

module.exports = model('Profile', ProfileSchema)