const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    username : String,
    email : String,
    age : Number,
    password : String,
    profileimage:Buffer,
    posts : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
});


module.exports = mongoose.model("user",userSchema);