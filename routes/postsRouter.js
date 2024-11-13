const express = require("express");
const router = express.Router();

const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");


router.post("/create",isLoggedIn,async (req,res)=>{
  try{
    let user = await userModel.findOne({email:req.user.email});
    let {content} = req.body;

    let post = await postModel.create({
        user:user._id,
        content
    });

    user.posts.push(post._id);
    await user.save();

    res.redirect("/users/profile");
  }
  catch(err){
    console.log(err.message);
  }
});

router.get("/edit/:id",isLoggedIn,async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
    res.render("editpost",{post});   
});

router.post("/update/:id",isLoggedIn,async (req,res)=>{
    let post = await postModel.findOneAndUpdate({_id:req.params.id},{content : req.body.content});
    res.redirect("/users/profile");   
});

router.get('/delete/:id',isLoggedIn,async (req,res)=>{
    try{
    let owner = await userModel.findOne({email:req.user.email});

    owner.posts.splice(owner.posts.indexOf(req.params.id),1);
    await owner.save();

    await postModel.deleteOne({_id:req.params.id});
    
    res.redirect("/users/profile");
    }
    catch(err){
        console.log(err.message);
    }
});


router.get('/like/:id',isLoggedIn,async (req,res)=>{
   try{
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
      
    if(post.likes.indexOf(req.user.id) === -1){
        if(post.unlikes.indexOf(req.user.id) !== -1){
            post.unlikes.splice(post.unlikes.indexOf(req.user.id),1);
        }
        post.likes.push(req.user.id);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.id),1);
    }
        
    await post.save();
    res.redirect("/allposts");
   }
   catch(err){
    console.log(err.message);
   }
});

router.get('/unlike/:id',isLoggedIn,async (req,res)=>{
   try{
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
    
    if(post.unlikes.indexOf(req.user.id) === -1){
        if(post.likes.indexOf(req.user.id) !== -1){
            post.likes.splice(post.likes.indexOf(req.user.id),1);
        }
        post.unlikes.push(req.user.id);
    }
    else{
        post.unlikes.splice(post.unlikes.indexOf(req.user.userid),1);
    }
    
    await post.save();
    res.redirect("/allposts");
   }
   catch(err){
    console.log(err.message);
   }
}); 


module.exports = router;