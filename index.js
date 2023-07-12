const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const registerValid = require("./validations/auth");
const UserSchema = require("./models/User");
const { validationResult } = require("express-validator");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Db Ok");
  })
  .catch((err) => {
    console.log("Db Error", err);
  });

const app = express();

app.use(express.json());
app.use(cors());

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ massage: "Пользователь не найден" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPassword) {
      return res.status(400).json({ massage: "Неверный логин или пароль" });
    }

    const token = jwt.sign({ _id: user._id }, "sec12", { expiresIn: "30d" });
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось авторизироваться" });
  }
});

app.post("/auth/reg", registerValid, async (req, res) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json(err.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(password, salt);

    const doc = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: Hash,
    });
    const user = await doc.save();
    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
});

app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server start");
});
