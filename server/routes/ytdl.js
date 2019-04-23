const fs = require("fs");
const ytdl = require("ytdl-core");
var express = require("express");
const router = express.Router();

//eventually change to post req
router.get("/convertURL", (req, res) => {
  ytdl("http://www.youtube.com/watch?v=A02s8omM_hI", {}).pipe(
    fs.createWriteStream("video.mp4")
  );
  res.send("Converted yt video");
});

router.get("/streamMP4", async (req, res) => {
  if (fs.existsSync("video.mp4")) {
    const src = fs.createReadStream("video.mp4");
    src.pipe(res);
  }
});

module.exports = router;
