const mongoose = require('mongoose');

var ClassDetails = new mongoose.Schema({

    className:{
        type: String,
        required: true,
    },
    section: {
        type: String
    },
    subject: {
        type: String
    },
    room: {
        type: String
    }
})

const Model = mongoose.model("ClassDetails", ClassDetails)
 Model.createCollection();
