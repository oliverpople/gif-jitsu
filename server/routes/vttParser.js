var express = require("express");
var path = require("path");
const { compile, parsed } = require("node-webvtt");
const fs = require("fs-extra");
require("dotenv").config();
const subtitleJSON = require("../testVTTScript.json");

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
  // Add error handling
});

module.exports = router;
