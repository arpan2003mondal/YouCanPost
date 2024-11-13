const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {generateToken} = require("../utills/generateToken");


module.exports.registerUser = async (req,res) => {

    try{
        let {name,username,email,password,age} = req.body;

        let user = await userModel.findOne({email});
    
        if(user) return res.status(500).send("User already registered");
    
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt, async function(err,hash){
                let createdUser = await userModel.create({
                    name,
                    username,
                    email,
                    password:hash,
                    age
                });    
        
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect('/users/login');    
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

    if(!user) return res.status(500).send("Something went wrong !!!");

    bcrypt.compare(password,user.password,function(err,result){

        if(result) {
            
            let token = generateToken(user);
            res.cookie("token", token);
            res.status(200).redirect("/users/profile");

        }else res.redirect('/users/login');
    });
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports.logoutUser = function(req,res){
    res.cookie("token","");
    res.redirect("/");
}
