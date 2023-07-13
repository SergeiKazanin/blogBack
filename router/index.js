const Router = require("express").Router;
const registerValid = require("../validations/auth");
const userController = require("../controllers/user-controller");

const router = new Router();

router.post("/auth/registration", registerValid, userController.registration);
router.post("/auth/login", userController.login);

module.exports = router;
