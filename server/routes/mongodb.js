const ytdl = require("ytdl-core");
require("dotenv").config();
var assert = require("assert");
var fs = require("fs");
var mongodb = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
var express = require("express");
const router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./public" });

var uri = process.env.DB_ROUTE;

router.post("/convertURLToMP4andStoreOnDb", (req, res) => {
  var videoMp4Stream = ytdl(req.body.YTUrl).pipe(
    fs.createWriteStream("convertedVideo.mp4")
  );

  videoMp4Stream.on("finish", function() {
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

router.post("/convertURLToMP4", (req, res) => {
  var videoMp4Stream = ytdl(req.body.YTUrl).pipe(
    fs.createWriteStream("convertedVideo.mp4")
  );

  videoMp4Stream.on("finish", function() {
    var readStream = fs.createReadStream("convertedVideo.mp4");
    readStream
      .pipe(res)
      .on("error", function(error) {
        assert.ifError(error);
        res.status(500).json({ error: "Internal server error" });
      })
      .on("finish", function() {
        console.log("Video converted to MP4");
        res.status(200).json({ status: "ok" });
        fs.unlink("convertedVideo.mp4", function(err) {});
      });
  });
});

router.get("/getAllVideoFileIdsFromDb", (req, res) => {
  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      db.collection("videos.files")
        .find({}, { _id: 1 })
        .toArray(function(err, videoFileIdsArray) {
          {
            $objectToArray: videoFileIdsArray;
          }
          if (err) throw err;
          res.json({ videoFileIdsArray });
          db.close();
        });
    }
  );
});

router.get("/getAllGifFileIdsFromDb", (req, res) => {
  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      db.collection("gifs.files")
        .find({}, { _id: 1 })
        .toArray(function(err, gifFileIdsArray) {
          {
            $objectToArray: gifFileIdsArray;
          }
          if (err) throw err;
          res.json({ gifFileIdsArray });
          db.close();
        });
    }
  );
});

router.post("/getUrlStreamForVideoWithId", (req, res) => {
  var id = req.body.id;

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

router.post("/getUrlStreamForGifWithId", (req, res) => {
  var id = req.body.id;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db, { bucketName: "gifs" });
      var downloadStream = bucket.openDownloadStream(new ObjectID(id));
      var writeStream = fs.createWriteStream(id);

      downloadStream
        .pipe(writeStream)
        .on("error", function(error) {
          assert.ifError(error);
        })
        .on("finish", function() {
          console.log("Downloaded gif to Server!");
          fs.createReadStream(id).pipe(res);
          fs.unlink(id, function(err) {});
        });
    }
  );
});

router.post("/getSubsForVideoWithId", (req, res) => {
  var id = req.body.id;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db, { bucketName: "videos" });

      var idObject = new ObjectID(id);

      db.collection("videos.files").findOne(
        { _id: idObject },
        { metadata: 1, _id: 0 },
        function(err, result) {
          if (err) throw err;
          var metadata = result.metadata;
          res.json({ metadata });
          db.close();
        }
      );
    }
  );
});

router.post("/addNewGifBlobToDb", upload.single("gifBlob"), function(req, res) {
  const fileName = req.file.filename;

  mongodb.MongoClient.connect(
    uri,
    { useNewUrlParser: true },
    function(error, db) {
      assert.ifError(error);

      var bucket = new mongodb.GridFSBucket(db, { bucketName: "gifs" });

      var readStream = fs.createReadStream("./public/" + fileName);
      var uploadStream = bucket.openUploadStream("gif.txt");

      readStream
        .pipe(uploadStream)
        .on("error", function(error) {
          assert.ifError(error);
          res.status(500).json({ error: "Internal server error" });
        })
        .on("finish", function() {
          console.log("Gif added the database!");
          res.status(200).json({ status: "ok" });
          fs.unlink("./public/" + fileName, function(err) {});
        });
    }
  );
});

module.exports = router;
