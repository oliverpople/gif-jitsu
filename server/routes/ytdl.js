const fs = require("fs");
const ytdl = require("ytdl-core");
var express = require("express");
const router = express.Router();

router.post("/convertURLToMP4", (req, res) => {
  ytdl(req.body.YTUrl).pipe(fs.createWriteStream("video.mp4"));
  res.send("Converted yt video");
  //Improve erro handling
});

router.get("/streamMP4", async (req, res) => {
  if (fs.existsSync("video.mp4")) {
    const src = fs.createReadStream("video.mp4");
    src.pipe(res);
  }
});

module.exports = router;
