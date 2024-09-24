const { Router } = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blackListModel");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const check = await userModel.findOne({ email });

    if (check) {
      return res
        .status(400)
        .json({ message: "This email is already registered, try to login" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password" });

      const user = new userModel({
        username,
        email,
        password: hash,
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    // console.log(password,user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const payload = { email };

    const access_token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "10min" },
      // (err, token) => {
      //   if (err) console.log(err);
      //   console.log(token);
      //   res.status(200).json({ token: token });
      // }
    );


    const refresh_token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "10min" },
      // (err, token) => {
      //   if (err) console.log(err);
      //   console.log(token);
      //   res.status(200).json({access_token,refresh_token});
      // }
    );

    res.status(200).json({access_token,refresh_token});
    // res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      res.json({ message: "token header is not present" });
    }

    const token = header.split(" ")[1];

    const blacklist = await blacklistModel.create({ token });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;
