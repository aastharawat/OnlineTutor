
const mongoose = require('mongoose');
 
mongoose.connect("mongodb://localhost:27017/DemoData", {useNewUrlParser: true,  useUnifiedTopology: true }, (error)=>{
    if(!error){
        console.log("Connection success")
    }
    else{
        console.log("failed!!")
    }
})

const Course = require("./DataModel");