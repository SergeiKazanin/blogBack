const { body } = require("express-validator");

const registerValid = [
  body("email", "Проверте почту").isEmail(),
  body("password", "Длина пароля больше 4 символов").isLength({ min: 4 }),
  body("fullName", "Длина имени больше 4 символов").isLength({ min: 4 }),
];

module.exports = registerValid;
