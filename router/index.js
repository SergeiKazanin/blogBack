const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");
const postController = require("../controllers/post-controller");
const multer = require("multer");
const validationErrors = require("../middlewares/validation-errors");
const { loginValid, registerValid, postValid } = require("../validations");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.post("/uploads", authMiddleware, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

router.get("/", (req, res) => {
  res.send("Backend for blog");
});

router.post(
  "/auth/registration",
  registerValid,
  validationErrors,
  userController.registration
);
router.post("/auth/login", loginValid, validationErrors, userController.login);
router.post("/auth/logout", userController.logout);
router.get("/auth/activate/:link", userController.activate);
router.get("/auth/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

router.get("/posts", postController.getAll);
router.get("/posts/:id", postController.getOne);
router.post(
  "/posts",
  authMiddleware,
  postValid,
  validationErrors,
  postController.createPost
);
router.delete("/posts/:id", authMiddleware, postController.delPost);
router.patch(
  "/posts/:id",
  authMiddleware,
  postValid,
  validationErrors,
  postController.updatePost
);

module.exports = router;
