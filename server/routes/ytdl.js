const ytdl = require("ytdl-core");
require("dotenv").config();
var assert = require("assert");
var fs = require("fs");
var mongodb = require("mongodb");
var express = require("express");
const router = express.Router();

router.post("/convertURLToMP4", (req, res) => {
  ytdl(req.body.YTUrl).pipe(fs.createWriteStream("video.mp4"));

  var uri = process.env.DB_ROUTE;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db);

      fs.createReadStream("video.mp4")
        .pipe(bucket.openUploadStream("dbVideo.mp4"))
        .on("error", function(error) {
          assert.ifError(error);
        })
        .on("finish", function() {
          console.log("Video added the database!");
          process.exit(0);
        });
    }
  );
});

router.get("/streamMP4", (req, res) => {
  var uri = process.env.DB_ROUTE;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    async function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db);

      bucket
        .openDownloadStreamByName("dbVideo.mp4")
        .pipe(fs.createWriteStream("outputVideo.mp4"))
        .on("error", function(error) {
          assert.ifError(error);
        })
        .on("finish", function() {
          console.log("Downloaded video to Server!");
          const src = fs.createReadStream("outputVideo.mp4");
          src.pipe(res);
          process.exit(0);
        });
    }
  );
});

module.exports = router;
