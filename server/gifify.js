module.exports = () => {
  var fs = require("fs");
  var gifify = require("gifify");
  var path = require("path");

  var input = path.join(__dirname, "movie.mp4");
  var output = path.join("../client/src", "movie.gif");

  var gif = fs.createWriteStream(output);

  var options = {
    resize: "400:-1",
    from: 0,
    // to:
    subtitles: path.join(__dirname, "movie.ass")
  };

  gifify(input, options).pipe(gif);
};
