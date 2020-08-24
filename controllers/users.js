const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./passport");
const User = require("../components/UserDetails");

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;

    // validate

    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." });
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    if (!displayName) displayName = email;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({
      token,
      isAuthenticated: true,
      user: {
        id: user._id,
        emil: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("authorization");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json({ isAuthenticated: true, email: user.email, id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/", auth, async (req, res) => {
//   const user = await User.findById(req.user);
//   res.json({
//     email: user.email,
//     id: user._id,
//   });
// });

router.get("/classList", auth, (req, res) => {
  User.findById({ _id: req.user })
    .populate("classes")
    .exec((err, document) => {
      if (err)
        res.status(500).json({
          message: { msgBody: "Something went wrong!", msgError: true },
        });
      else res.status(200).json({ classes: document.classes });
    });
});

router.post("/class", auth, (req, res) => {
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
});

module.exports = router;
