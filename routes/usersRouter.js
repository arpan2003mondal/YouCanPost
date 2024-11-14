const express = require("express");
const router = express.Router();

const {registerUser,loginUser,logoutUser} = require("../controllers/authControllers");
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middlewares/isLoggedIn");

const upload = require("../config/multer-config");


router.post("/register",registerUser);


router.post("/login",loginUser);


router.get("/logout",logoutUser)

router.get('/profile',isLoggedIn,async (req,res)=>{
   try{
    let messages = {
        error: req.flash("error"),
        success: req.flash("success")
    };
    let user = await userModel.findOne({email:req.user.email}).populate("posts");
    res.render("profile",{user,messages});
   }
   catch(err){
    console.log(err.message);
   }
});

router.get('/profile/update',isLoggedIn,async (req,res)=>{
    try{
        let user = await userModel.findOne({email:req.user.email});
        res.render("updateprofile",{user});
    }catch(err){
        console.log(err.message);
    }
})

router.post('/profile/update',isLoggedIn,async (req,res)=>{
    try{
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
    req.flash("success","Profile updated successfully");
    res.redirect("/users/profile");
    }
    catch(err){
        req.flash("error","Unsuccessful: Error message : "+err.message);
        res.redirect("/users/profile");
    }
});


router.get("/password/change",async (req,res)=>{
    res.render("updatePassword");
})


router.post('/password/change',isLoggedIn, async (req,res)=>{

    try{
     let user = await userModel.findOne({email:req.user.email});
     let {currentpassword,newpassword} = req.body;
 
     bcrypt.compare(currentpassword,user.password,function(err,result){    
         if(result) {        
             bcrypt.genSalt(10,function(err,salt){             
                 bcrypt.hash(newpassword,salt, async function(err,hash){
                     user.password = hash;
                     await user.save();
                     }); 
                req.flash("success","Password Changed Successfully");
                res.redirect("/users/profile");
         });
     }else {
        req.flash("error","Unsuccessful: Old password does not match");
        res.redirect('/users/profile');
     }
     });
    }
    catch(err){
        req.flash("error","Unsuccessful: Error message : "+err.message);
        res.redirect("/users/profile");
    }  
 });

router.post("/profileImage/upload",isLoggedIn,upload.single("image"), async (req,res)=>{
   try{
    let user = await userModel.findOne({email:req.user.email});

    user.profileImage = req.file.buffer;
    await user.save();
    req.flash("success","Profile photo uploaded");
    res.redirect("/users/profile");
   }
   catch(err){
    req.flash("error","Unsuccessful: Error message : "+err.message);
    res.redirect("/users/profile");
   }
});

module.exports = router;