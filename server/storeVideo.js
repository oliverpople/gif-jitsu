require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
///establish mongoDB connection
// this is our MongoDB database
const dbRoute = process.env.DB_ROUTE;
// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);
// mongoose.connect("mongodb://127.0.0.0.1/gridFS");
var conn = mongoose.connection;
var path = require("path");
// require gridfs
var Grid = require("gridfs-stream");
// require filesystam module
var fs = require("fs");

// where to find the video in the filesystam that we will store on db
var videoPath = path.join(__dirname, "./video.mp4");

// connect GridFS  AND mongo
Grid.mongo = mongoose.mongo;

conn.once("open", function() {
  console.log("- Connection open -");
  var gfs = Grid(conn.db);

  // when connection is open, create write stream width
  // the name of store file as in the db
  var writestream = gfs.createWriteStream({
    //will be stored in Mongo as "video.mp4"\
    filename: "video.mp4"
  });
  // create a read-stream from where the video currently is (videoPath)
  // and pipe it into the database (through write stream)
  fs.createReadStream(videoPath).pipe(writestream);

  writestream.on("close", function(file) {
    // do something with the 'file'
    // console logign that it was written successfully
    console.log(file.filename + "Written to db");
  });
});
