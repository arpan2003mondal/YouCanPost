const express = require("express");
const router = express.Router();

const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/",(req,res)=>{
    res.render("index");
});


router.get("/allposts",isLoggedIn, async (req,res)=>{
    try {
       
        const posts = await postModel.find()
            .populate("user")           
            .populate("likes")         
            .exec();

        res.render("allposts", { posts });  
    } catch (error) {
        res.status(500).send('Error fetching posts');
        console.error(error.message);
    }
});




module.exports = router;