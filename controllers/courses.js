const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const ClassDetails = mongoose.model("ClassDetails")

router.post('/classes', async (req,res) => {
    const classDetail = new ClassDetails({
        className: req.body.className,
        section: req.body.section,
        subject: req.body.subject,
        room: req.body.room
    })
    const result = await classDetail.save()
    res.json(result);
});

router.get('/list/:id', async (req, res) => {  
    const response = await ClassDetails.findById(req.params.id);
    res.json( response);
});

router.get('/list', async (req, res) => {  
    const response = await ClassDetails.find();
    res.json(response);
});

module.exports = router; 

    