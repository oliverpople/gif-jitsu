import React, { Component } from "react";
import gifshot from "gifshot";

export default class VideoSnapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.videoRef = React.createRef();
    this.outputRef = React.createRef();

    this.state = {
      scaleFactor: 0.25,
      snapShots: [],
      videoRef: null,
      outputRef: null
    };
  }

  componentDidMount() {
    this.setState({
      videoRef: this.videoRef.current,
      outputRef: this.outputRef.current
    });
  }

  capture = () => {
    let { videoRef, outputRef, scaleFactor, snapShots } = this.state;
    if (scaleFactor == null) {
      scaleFactor = 1;
    }
    var output = outputRef;
    var video = videoRef;
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    var image = new Image(w, h);
    image.crossOrigin = "anonymous";
    image.src = canvas.toDataURL();
    snapShots.unshift(image);
    output.innerHTML = "";
    this.state.snapShots.map(snapShot => output.appendChild(snapShot));
  };

  createGif = () => {
    gifshot.createGIF(
      {
        images: this.state.snapShots
      },
      function(obj) {
        if (!obj.error) {
          var image = obj.image,
            animatedImage = document.createElement("img");
          animatedImage.src = image;
          document.body.appendChild(animatedImage);
        }
      }
    );
  };

  render() {
    return (
      <div className="wrap">
        <video
          crossOrigin="anonymous"
          ref={this.videoRef}
          width={320}
          controls={true}
        >
          <source src="http://techslides.com/demos/sample-videos/small.webm" />
        </video>
        <br />
        <button onClick={this.capture} className="button">
          Capture
        </button>
        <br />
        <div ref={this.outputRef} />
        <button onClick={this.createGif} className="button">
          Create Gif
        </button>
      </div>
    );
  }
}
