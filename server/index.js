const express = require("express");
require("dotenv").config();
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const mongoose = require("mongoose");
const port = 4000;
const app = express().use("*", cors());
const router = express.Router();
var mongodb = require("./routes/mongodb");

// this is our MongoDB database
const dbRoute = process.env.DB_ROUTE;
// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    parameterLimit: 100000,
    extended: true
  })
);
app.use(
  bodyParser.json({
    limit: "5mb"
  })
);

// append /api for our http requests
app.use("/", router);

// app.get("/", (req, res) => res.send("Hello World!"));
app.use("/mongodb", mongodb);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
