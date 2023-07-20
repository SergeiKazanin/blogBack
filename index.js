const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

mongoose
  .connect("mongodb://mongodb:27017")
  .then(() => {
    console.log("Db Ok");
  })
  .catch((err) => {
    console.log("Db Error", err);
  });

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(cookieParser());
app.use("/", router);
app.use(errorMiddleware);

app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server start");
});
