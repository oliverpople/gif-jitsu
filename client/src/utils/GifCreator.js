import gifshot from "gifshot";

export default function GifCreator(imageArray, callback) {
  gifshot.createGIF(
    { images: imageArray, frameDuration: 10, gifWidth: 320, sampleInterval: 1 },
    function(obj) {
      if (!obj.error) {
        var image = obj.image;
        return callback(image);
      } else {
        console.log("error from gifshot!");
      }
    }
  );
}
