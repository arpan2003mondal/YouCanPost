const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser} = require("../controllers/authControllers");
const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const bcrypt = require("bcrypt");
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
    res.redirect("/users/profile");
    }
    catch(err){
        console.log(err.message);
    }
});


router.get('/password/change',async (req,res)=>{
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
                 res.redirect('/users/login?message=Password changed successfully');
         });
     }else {
         res.redirect('/users/profile');
     }
     });
    }
    catch(err){
     console.log(err.message);
    }  
 });

module.exports = router;