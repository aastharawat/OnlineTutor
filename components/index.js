const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.w8tzz.mongodb.net/${process.env.MONGO_DB_DATABASE}<?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (error) => {
      if (!error) {
        console.log("Connection success");
      } else {
        console.log("failed!!");
      }
    }
  )


const Course = require("./ClassDetails");
const User = require("./UserDetails");
