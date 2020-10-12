require("./components");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const UserController = require("./controllers/users");

// *******GENERAL*******
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const passport = require("passport");
var cors = require("cors");
app.use(cors({ origin: "*" }));
// *******PASSPORT AUTHENTICATION*********
require("./controllers/passport");
app.use(passport.initialize());

// ******* ROUTES ********
app.use("/user", UserController);

app.get("/", (req, res) => {
    res.status(200).send("Hello");
  });
const PORT = process.env.port || 8000;
app.listen(PORT);
