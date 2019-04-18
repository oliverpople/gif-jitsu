var express = require("express");
const { compile } = require("node-webvtt");
const fs = require("fs-extra");
require("dotenv").config();
const subtitleJSON = require("../testVTTScript.json");
var router = express.Router();

router.get("/", async function(req, res) {
  // export default async function vtt(subtitleJSON) {

  const subtitleText = compile(subtitleJSON);
  const vttFile = await fs.writeFile(
    "convertedSubtitles.vtt",
    subtitleText,
    "UTF-8"
  );
  if (!error) {
    res.send(vttFile);
  } else {
    res.status(500).json({ error: error });
  }

  // }
});

module.exports = router;
