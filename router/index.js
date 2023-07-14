const Router = require("express").Router;
const userController = require("../controllers/user-controller");

const router = new Router();
router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/auth/registration", userController.registration);
router.post("/auth/login", userController.login);
router.post("/auth/logout", userController.logout);
router.post("/auth/activate:link", userController.activate);
router.post("/auth/refresh", userController.refresh);

module.exports = router;
