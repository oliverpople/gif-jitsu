var express = require("express");
var path = require("path");
const { compile, parsed } = require("node-webvtt");
const fs = require("fs-extra");
require("dotenv").config();
const subtitleJSON = require("../testVTTScript.json");
// const convertedFile = require("../convertedSubtitles.txt");
var router = express.Router();

router.get("/", async function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "convertedSubtitles.vtt"));

  // const subtitleText = compile(subtitleJSON);
  // const vttFile = await fs.writeFile(
  //   "convertedSubtitles.vtt",
  //   subtitleText,
  //   "UTF-8"
  // );
  // if (!error) {
  //   res.send(vttFile);
  // } else {
  //   res.status(500).json({ error: error });
  // }
});

module.exports = router;
