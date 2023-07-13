const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/User");
const { validationResult } = require("express-validator");

class UserController {
  async registration(req, res) {
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
  }
  async login(req, res) {
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
  }
}

module.exports = new UserController();
