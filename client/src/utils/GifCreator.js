import gifshot from "gifshot";

export default function GifCreator(imageArray) {
  gifshot.createGIF({ images: imageArray, frameDuration: 10 }, function(obj) {
    if (!obj.error) {
      var image = obj.image,
        animatedImage = document.createElement("img");
      animatedImage.src = image;
      document.body.appendChild(animatedImage);
    }
  });
}
