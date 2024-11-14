const express = require("express");
const router = express.Router();

const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");


router.post("/create",isLoggedIn,async (req,res)=>{
  try{
    let user = await userModel.findOne({email:req.user.email});
    let {content} = req.body;

    if (!content || content.trim() === "") {
        req.flash("error", "Post content cannot be empty.");
        return res.redirect("/users/profile");
      }

    let post = await postModel.create({
        user:user._id,
        content
    });

    user.posts.push(post._id);
    await user.save();
    req.flash("success","New post created");
    res.redirect("/users/profile");
  }
  catch(err){
    req.flash("error","Unsuccessful: Error message : "+err.message);
    res.redirect("/users/profile");
  }
});

router.get("/edit/:id",isLoggedIn,async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate("user");
    res.render("editpost",{post});   
});

router.post("/update/:id",isLoggedIn,async (req,res)=>{
    try{
    let post = await postModel.findOneAndUpdate({_id:req.params.id},{content : req.body.content});
    req.flash("success","Your post is updated");
    res.redirect("/users/profile");   
    }
    catch(err){
        req.flash("error","Unsuccessful: Error message : "+err.message);
        res.redirect("/users/profile");
    }
});

router.get('/delete/:id',isLoggedIn,async (req,res)=>{
    try{
    let owner = await userModel.findOne({email:req.user.email});

    owner.posts.splice(owner.posts.indexOf(req.params.id),1);
    await owner.save();

    await postModel.deleteOne({_id:req.params.id});
    req.flash("success","Your post is deleted");
    res.redirect("/users/profile");
    }
    catch(err){
        req.flash("error","Unsuccessful: Error message : "+err.message);
        res.redirect("/users/profile");
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
    req.flash("success","You liked the post");
   }
   catch(err){
    req.flash("error","Unsuccessful: Error message : "+err.message);
   }
    finally{
    res.redirect("/allposts");
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
    req.flash("error","You unliked the post");
    await post.save();
   }
   catch(err){
    req.flash("error","Unsuccessful: Error message : "+err.message);
   }
   finally{
    res.redirect("/allposts");
   }
}); 


module.exports = router;