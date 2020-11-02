const express = require("express");
const router = express.Router();

const { User } = require("../models");

const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");

// User sinup
router.post("/user/signup", async (req, res) => {
  try {
    const email = req.fields.email;
    const password = req.fields.password;
    const userExists = await User.findOne({ email: email });
    if (email && password) {
      if (userExists) {
        res.status(400).json({ message: "This email is already registered" });
      } else {
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = new User({
          email: email,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();

        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// User login
router.post("/user/login", async (req, res) => {
  try {
    const email = req.fields.email;
    const password = req.fields.password;
    const userExists = await User.findOne({ email: email });

    if (email && password) {
      if (userExists) {
        const hash = SHA256(password + userExists.salt).toString(encBase64);

        if (hash === userExists.hash) {
          res.status(200).json({
            _id: userExists._id,
            token: userExists.token,
            email: userExists.email,
          });
        } else {
          res.status(400).json({ message: "Invalid password, try again" });
        }
      } else {
        res
          .status(404)
          .json({ message: "This email address is not registered" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
