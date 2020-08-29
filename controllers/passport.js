const jwt = require("jsonwebtoken");
const User = require("../components/UserDetails");
const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization denied." });

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    await User.findById(verified.id).then((res) => {
      req.user = res;
    });
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;
