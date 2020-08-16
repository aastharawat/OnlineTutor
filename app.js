require("./components");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const CourseController = require("./controllers/classes");
const UserController = require("./controllers/users");

// *******GENERAL*******
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

var cors = require("cors");
const passport = require("passport");
app.use(cors());

// *******PASSPORT AUTHENTICATION*********
require("./controllers/passport");
app.use(passport.initialize());

// ******* ROUTES ********
app.use("/user", UserController);

app.listen(8000);
