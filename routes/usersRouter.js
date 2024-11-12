const express = require("express");
const router = express.Router();
const {registerUser,loginUser,logoutUser} = require("../controllers/authControllers");


router.get('/create',(req,res)=>{
    res.render('register');
})

router.post("/register",registerUser);

router.get('/login',(req,res)=>{
    res.render('login');
})

router.post("/login",loginUser);

router.get("/logout",logoutUser)

module.exports = router;