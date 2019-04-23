const express = require("express");
require("dotenv").config();
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const mongoose = require("mongoose");
const port = 4000;
var ytdl = require("./routes/ytdl");
var CRUD = require("./routes/CRUD");
const app = express().use("*", cors());
const router = express.Router();

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// append /api for our http requests
app.use("/", router);

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/ytdl", ytdl);
app.use("/getData", CRUD);
app.use("/updateData", CRUD);
app.use("/deleteData", CRUD);
app.use("/putData", CRUD);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
