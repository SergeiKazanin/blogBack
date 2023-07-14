const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./router/index");

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
app.use(cors());
app.use(cookieParser());
app.use("/", router);

app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Server start");
});
