const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.connect(
  process.env.DB_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (!error) {
      console.log("Connection success");
    } else {
      console.log("failed!!");
    }
  }
);

const Course = require("./ClassDetails");
const User = require("./UserDetails");
