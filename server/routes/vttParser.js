var express = require("express");
var path = require("path");
const { compile, parsed } = require("node-webvtt");
const fs = require("fs-extra");
require("dotenv").config();
const subtitleJSON = require("../testVTTScript.json");
// const convertedFile = require("../convertedSubtitles.txt");

var router = express.Router();

router.post("/", async function(req, res) {
  const subtitleText = compile(req.body.data);
  const vttFile = await fs.writeFile(
    "./public/convertedSubtitles.vtt",
    subtitleText,
    "UTF-8"
  );
  res.sendFile(path.join(__dirname, "../public", "convertedSubtitles.vtt"));

  /// then delete file

  // if (!error) {
  //   res.sendFile(path.join(__dirname, "../public", "convertedSubtitles.vtt"));
  // } else {
  //   res.status(500).json({ error: error });
  // }
});

module.exports = router;
