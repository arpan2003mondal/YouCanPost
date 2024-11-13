const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser} = require("../controllers/authControllers");
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");

const isLoggedIn = require("../middlewares/isLoggedIn");

router.get('/create',(req,res)=>{
    res.render('register');
})

router.post("/register",registerUser);

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post("/loginAccount",loginUser);


router.get("/logout",logoutUser)

router.get('/profile',isLoggedIn,async (req,res)=>{
   try{
    let user = await userModel.findOne({email:req.user.email}).populate("posts");
    res.render("profile",{user});
   }
   catch(err){
    console.log(err.message);
   }
});

router.get('/profile/edit',isLoggedIn,async (req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email});
        res.render("updateprofile",{user});
    }catch(err){
        console.log(err.message);
    }
})

app.post('/updateprofile',isLoggedIn,async (req,res)=>{

let {name,username,age}=req.body;
const filter = { email:req.user.email};

const updateDocument = {
   $set: {
      name,
      username,
      age
   },
};
await userModel.updateMany(filter, updateDocument);
    
res.redirect("/profile");
})


module.exports = router;