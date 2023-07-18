const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const { body } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/", (req, res) => {
  res.send("hello");
});

router.post(
  "/auth/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  userController.registration
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/activate/:link", userController.activate);
router.get("/auth/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

module.exports = router;
