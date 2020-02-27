const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const CourseModel = mongoose.model("Course")

router.get("/list", (req, res) => {

    CourseModel.find((err, docs) =>{
        if(!err){
            console.log(docs);
            res.send("Reuest send to the database")
        }
    })
});

module.exports = router; 