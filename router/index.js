const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const PostController = require("../controllers/post-controller");
const { body } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");
const postController = require("../controllers/post-controller");

router.get("/", (req, res) => {
  res.send("Backend for blog");
});

router.post(
  "/auth/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  body("fullName").isLength({ min: 4, max: 10 }),
  userController.registration
);
router.post(
  "/auth/login",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  userController.login
);
router.post("/auth/logout", userController.logout);
router.get("/auth/activate/:link", userController.activate);
router.get("/auth/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

router.get("/posts", postController.getAll);
router.get("/posts/:id", postController.getOne);
router.post("/posts", authMiddleware, postController.createPost);
router.delete("/posts/:id", authMiddleware, postController.delPost);
router.patch("/posts/:id", authMiddleware, postController.updatePost);

module.exports = router;
