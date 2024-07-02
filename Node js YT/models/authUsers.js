const mongoose = require("mongoose");

// new collection for login functionality, created users 
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user",
        require: true
    }
},
{
    timestamps:true
})

// authuser is a collection name
const AuthUserModel = mongoose.model('authuser', userSchema);

module.exports = AuthUserModel;