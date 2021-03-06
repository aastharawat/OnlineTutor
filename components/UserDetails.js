const mongoose = require("mongoose");

var UserDetails = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassDetails",
    },
  ],
});

module.exports = Model = mongoose.model("UserDetails", UserDetails);
Model.createCollection();
