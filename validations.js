const { body } = require("express-validator");

const registerValid = [
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  body("fullName").isLength({ min: 4, max: 10 }),
];
const loginValid = [
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
];
const postValid = [
  body("title").isLength({ min: 3 }).isString(),
  body("text").isLength({ min: 3 }).isString(),
  body("tags").optional().isArray(),
  body("imageUrl").optional().isString(),
];

module.exports = { registerValid, loginValid, postValid };
