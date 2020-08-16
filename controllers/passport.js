const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const connection = require("./../components/index");
const mongoose = require("mongoose");
const UserDetails = mongoose.model("UserDetails");
const bcrypt = require("bcrypt");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
    console.log(token);
  }
  return token;
};

const verifyCallback = (username, password, done) => {
  console.log("hello");
  UserDetails.findOne({ email: username })
    .then((user) => {
      if (!user) {
        console.log(user, "user");
        return done(null, false);
      }

      const valid = bcrypt.compare(password, user.password);
      if (valid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    verifyCallback
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (payload, done) => {
      const user = await UserDetails.findOne({ email: payload.email });
      return user
        ? done(null, user)
        : done(null, false, {
            error: "Your login details are not valid",
          });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserDetails.findById(id, function (err, user) {
    done(err, user);
  });
});
