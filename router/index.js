const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");
const postController = require("../controllers/post-controller");
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage,
  limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 },
});
const mongoose = require("mongoose");

const validationErrors = require("../middlewares/validation-errors");
const { loginValid, registerValid, postValid } = require("../validations");
const db = mongoose.connection;
const mongodb = require("mongodb");
const { Readable } = require("stream");
const ObjectID = require("mongodb").BSON.ObjectId;

router.post("/uploads", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Upload Request Validation Failed" });
    } else if (!req.file.originalname) {
      return res.status(400).json({ message: "No photo name in request body" });
    }

    let photoName = req.file.originalname;

    // Covert buffer to Readable Stream
    const readablePhotoStream = new Readable();
    readablePhotoStream.push(req.file.buffer);
    readablePhotoStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: "image",
    });

    let uploadStream = bucket.openUploadStream(photoName);
    let id = uploadStream.id;
    readablePhotoStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        id: id,
      });
    });
  });
});

router.get("/uploads/:photoID", (req, res) => {
  try {
    var photoID = new ObjectID(req.params.photoID);
  } catch (err) {
    return res.status(400).json({
      message:
        "Invalid PhotoID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters",
    });
  }

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: "image",
  });

  let downloadStream = bucket.openDownloadStream(photoID);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
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
