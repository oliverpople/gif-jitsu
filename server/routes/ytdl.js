const ytdl = require("ytdl-core");
require("dotenv").config();
var assert = require("assert");
var fs = require("fs");
var mongodb = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
var express = require("express");
const router = express.Router();

// var count = 0;

router.post("/convertURLToMP4", (req, res) => {
  // count += 1;
  var videoMp4Stream = ytdl(req.body.YTUrl).pipe(
    fs.createWriteStream("convertedVideo.mp4")
  );

  videoMp4Stream.on("finish", function() {
    var uri = process.env.DB_ROUTE;

    mongodb.MongoClient.connect(
      uri,
      { useNewUrlParser: true },
      function(error, db) {
        assert.ifError(error);

        var bucket = new mongodb.GridFSBucket(db, { bucketName: "videos" });
        var readStream = fs.createReadStream("convertedVideo.mp4");
        var uploadStream = bucket.openUploadStream("video.mp4");

        readStream
          .pipe(uploadStream)
          .on("error", function(error) {
            assert.ifError(error);
            res.status(500).json({ error: "Internal server error" });
          })
          .on("finish", function() {
            console.log("Video added the database!");
            res.status(200).json({ status: "ok" });
            fs.unlink("convertedVideo.mp4", function(err) {});
          });
      }
    );
  });
});

router.get("/streamMP4", (req, res) => {
  var uri = process.env.DB_ROUTE;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db, { bucketName: "videos" });

      var downloadStream = bucket.openDownloadStreamByName(count.toString());
      var writeStream = fs.createWriteStream("outputVideo.mp4");

      downloadStream
        .pipe(writeStream)
        .on("error", function(error) {
          assert.ifError(error);
        })
        .on("finish", function() {
          console.log("Downloaded video to Server!");
          fs.createReadStream("outputVideo.mp4").pipe(res);
          fs.unlink("outputVideo.mp4", function(err) {});
        });
    }
  );
});

router.post("/getUrlStreamForVideoWithId", (req, res) => {
  var id = req.body.id;
  var uri = process.env.DB_ROUTE;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db, { bucketName: "videos" });

      var downloadStream = bucket.openDownloadStream(new ObjectID(id));
      var writeStream = fs.createWriteStream(id + ".mp4");

      downloadStream
        .pipe(writeStream)
        .on("error", function(error) {
          assert.ifError(error);
        })
        .on("finish", function() {
          console.log("Downloaded video to Server!");
          fs.createReadStream(id + ".mp4").pipe(res);
          fs.unlink(id + ".mp4", function(err) {});
        });
    }
  );
});

router.get("/getAllVideoFileIds", (req, res) => {
  var uri = process.env.DB_ROUTE;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      db.collection("videos.files")
        .find({}, { _id: 1 })
        .toArray(function(err, fileIdsArray) {
          {
            $objectToArray: fileIdsArray;
          }
          if (err) throw err;
          res.json({ fileIdsArray });
          db.close();
        });
    }
  );
});

module.exports = router;
