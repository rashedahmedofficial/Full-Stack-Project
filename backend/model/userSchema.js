const { Timestamp } = require("mongodb");
const bcrypt = require('bcrypt');
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
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        avatar:{
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
) ;
 userShema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt (12)
  this.password = await bcrypt.hash(this.password, salt);
});



module.exports = mongoose.model('users',userShema )