require("./components");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const UserController = require("./controllers/users");

const port = process.env.PORT || 8000;

// *******GENERAL*******
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname))
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
app.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});
