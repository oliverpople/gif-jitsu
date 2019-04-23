const fs = require("fs");
const ytdl = require("ytdl-core");
var express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Testing route.");
});

module.exports = router;
