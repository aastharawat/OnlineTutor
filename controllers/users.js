const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const router = express.Router();
const UserDetails = mongoose.model("UserDetails");
const passport = require("passport");
const ClassDetails = mongoose.model("ClassDetails");
const bcrypt = require("bcrypt");

//register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordCheck, userName, classes } = req.body;
    const existingUSer = await UserDetails.findOne({ email: email });

    if (existingUSer)
      return res
        .status(400)
        .json({ msg: "An account with this email exists." });
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields entered" });

    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password should have atleast 5 characters" });

    if (password !== passwordCheck)
      return res.status(400).json({ msg: "Password donot match" });

    if (!userName) userName = email;
    const pwd = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, pwd);

    const userDetails = new UserDetails({
      email,
      password: passwordHash,
      userName,
      classes,
    });
    const savedUser = await userDetails.save();
    res.json(savedUser);
  } catch (err) {
    res.json(err);
  }
});

//login

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    var token = jwt.sign(
      { email: req.body.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.cookie("access_token", token, { httpOnly: true, sameSite: true });
    res
      .status(200)
      .json({ isAuthenticated: true, user: { email: req.body.email } });
  }
);

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),

  (req, res, next) => {
    res.clearCookie("access_token");
    const userName = req.user;
    res.status(200).json({ isAuthenticated: false, user: { userName } });

    next();
  }
);

router.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const userName = req.user;
    res.status(200).json({ isAuthenticated: true, user: { userName } });
  }
);

router.get(
  "/classList",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    UserDetails.findById({ _id: req.user._id })
      .populate("classes")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Something went wrong!", msgError: true },
          });
        else
          res
            .status(200)
            .json({ classes: document.classes, authenticated: true });
      });
  }
);

// router.post(
//   "courses/class",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     const classDetail = new ClassDetails({
//       className: req.body.className,
//       section: req.body.section,
//       subject: req.body.subject,
//       room: req.body.room,
//     });
//     const result = await classDetail.save();
//     res.json(result);
//   }
// );

router.post(
  "/class",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const classDetail = new ClassDetails({
      className: req.body.className,
      section: req.body.section,
      subject: req.body.subject,
      room: req.body.room,
    });
    classDetail.save((err) => {
      if (err)
        res.status(500).json({
          message: { msgBody: "Something went wrong!", msgError: true },
        });
      else {
        req.user.classes.push(classDetail);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Something went wrong!", msgError: true },
            });
          else
            res.status(200).json({
              message: { msgBody: "Successfully created!", msgError: false },
            });
        });
      }
    });
  }
);

module.exports = router;
