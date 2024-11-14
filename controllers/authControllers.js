const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {generateToken} = require("../utills/generateToken");


module.exports.registerUser = async (req,res) => {

    try{
        let {name,username,email,password,age} = req.body;

        if (!name || !username || !email || !password || !age) {
            req.flash("error", "All fields are required!");
            return res.redirect("/");
        }

        let user = await userModel.findOne({email});
    
        if(user) {
            req.flash("error","You already have an account , please login");
            return res.redirect("/");
        }
    
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt, async function(err,hash){

                if(err) return res.status(504).send(err.message);

                let createdUser = await userModel.create({
                    name,
                    username,
                    email,
                    password:hash,
                    age
                });    
        
            req.flash("success"," user created successfully,please login");
            return res.redirect("/");  
            });  
        });
    }
    catch(err){
        console.log(err.message);
        }   
}

module.exports.loginUser = async (req,res) => {
    try{
        let {email,password} = req.body;

    let user = await userModel.findOne({email});

    if(!user) {
        req.flash("error","Wrong email or password");
        return res.redirect("/");
    }

    bcrypt.compare(password,user.password,function(err,result){

        if(result) {           
            let token = generateToken(user);
            res.cookie("token", token);
            req.flash("success"," Logged in successfully");
            return res.redirect("/users/profile");
        }
        else{
            req.flash("error","Wrong email or password");
            return res.redirect("/");
        }
    });
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports.logoutUser = function(req,res){
    try{
        res.cookie("token","");
        req.flash("error","Logged out successfully");
        res.redirect("/");
       }
       catch(err){
        console.log(err.message);
       }
}
