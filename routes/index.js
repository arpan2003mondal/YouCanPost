const express = require("express");
const router = express.Router();

const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/",(req,res)=>{
    let messages = {
        error: req.flash("error"),
        success: req.flash("success")
    };
    res.render("index", { messages ,loggedin:false});
});


router.get("/allposts",isLoggedIn, async (req,res)=>{
    
    try {

        let messages = {
            error: req.flash("error"),
            success: req.flash("success")
        };
        const posts = await postModel.find()
            .populate("user")           
            .populate("likes")         
            .populate("unlikes") 
            .exec();

        res.render("allposts", { posts, messages });

    } catch (err) {
        req.flash("error","Unsuccessful: Error message : "+err.message);
        res.redirect("/users/profile");
    }
});




module.exports = router;