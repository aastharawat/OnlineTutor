const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const router = express.Router();
const UserDetails = mongoose.model("UserDetails")

const bcrypt = require("bcrypt");
const { genSalt } = require("bcrypt");

//register new user
router.post("/register", async (req, res) => {
    try{

    const {email, password, passwordCheck, userName} = req.body;
    const existingUSer = await UserDetails.findOne({email: email});

    if(existingUSer)
        return res.status(400)
        .json({msg: "An account with this email exists."});
    if(!email || ! password || ! passwordCheck)
        return res.status(400)
        .json({msg: "Not all fields entered"});

    if(password.length < 5)
        return res.status(400)
        .json({msg: "The password should have atleast 5 characters"});

    if(password !== passwordCheck)
        return res.status(400)
        .json({msg: "Password donot match"});

    
    if(!userName) 
        userName= email;
    const pwd = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, pwd)

    const userDetails = new UserDetails({
        email,
        password: passwordHash,
        userName
    })
    const savedUser = await userDetails.save();
    res.json(savedUser);
    }
    catch(err){
        res.json(err)
    } 
})

//login 

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password)
            return(res.status(400).json({msg: "Enter all fields"}))
        const user = await UserDetails.findOne({email: email});
        if(!user)
            return(res.status(400).json({msg: "User does not exist"}));
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid credentials"})
        // const token = jwt.sign({id: user._id}, process.env.JWT_KEY);
        res.json({ user: {
            id: user._id,
            userName: user.userName,
            email: user.email
        }})

        
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router; 
