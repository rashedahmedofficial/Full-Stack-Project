const { Timestamp } = require("mongodb");
const mongoose =require("mongoose")
const { Schema } = mongoose;

const userShema = new Schema (
    {
        username:{
            type: String,
            require:true,
        },
        email:{
            type: String,
            require:true,
            unique:true,
            trim:true,
        },
        password:{
            type: String,
            require:true,
            trim:true,
        }
    },
    {
        timestamps: true,
    }
) 

module.exports = mongoose.model('users',userShema )