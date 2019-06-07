import React, { Component } from "react";
import GifCreator from "./utils/GifCreator";

export default class VideoSnapper extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      scaleFactor: 0.25,
      snapShots: [],
      playerSource: null
    };
  }

  componentWillMount() {
    this.getUrlStreamForVideoWithId(this.props.fileId);
  }

  getUrlStreamForVideoWithId = async id => {
    fetch("http://localhost:4000/mongodb/getUrlStreamForVideoWithId", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
      .then(re => re.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        this.setState({ playerSource: url });
      })
      .catch(err => {
        console.log(err);
      });
  };

  capture = () => {
    let { scaleFactor, snapShots } = this.state;
    if (scaleFactor == null) {
      scaleFactor = 1;
    }
    var output = document.getElementById("output");
    var video = document.getElementById(this.state.playerSource);
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
    GifCreator(this.state.snapShots);
  };

  render() {
    return (
      <div>
        {this.state.playerSource ? (
          <video
            key={this.props.playerSource}
            crossOrigin="anonymous"
            id={this.state.playerSource}
            width={320}
            controls={true}
            muted={true}
            autoPlay={true}
            loop
            src={this.state.playerSource}
          />
        ) : (
          <div />
        )}
        <br />
        <button onClick={this.capture} className="button">
          Capture
        </button>
        <br />
        <div id={"output"} />
        <button onClick={this.createGif} className="button">
          Create Gif
        </button>
      </div>
    );
  }
}
