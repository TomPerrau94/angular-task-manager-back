const { User } = require("../models");

const isAuthenticated = async (req, res, next) => {
  const auhtorization = req.headers.authorization;
  if (auhtorization) {
    const token = auhtorization.replace("Bearer ", "");

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
