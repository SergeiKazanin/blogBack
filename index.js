const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Db Ok");
  })
  .catch((err) => {
    console.log("Db Error", err);
  });

const app = express();

app.use(express.json());
//app.use("/uploads", express.static("uploads"));
app.use(
  // cors({
  //   credentials: true,
  //   origin: process.env.CLIENT_URL,
  // }) 
  cors({credentials: true})
);
app.use(cookieParser());
app.use("/", router);
app.use(errorMiddleware);

app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server start");
});
