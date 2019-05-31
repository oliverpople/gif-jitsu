import React, { Component } from "react";

export default class VideoSnapper extends Component {
  constructor(props, context) {
    super(props, context);
    this.videoRef = React.createRef();
    this.outputRef = React.createRef();

    this.state = {
      scaleFactor: 0.25,
      snapshots: [],
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

  capture = video => {
    let { scaleFactor } = this.state;
    if (scaleFactor == null) {
      scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    return canvas;
  };

  shoot = () => {
    let { snapshots, videoRef, outputRef } = this.state;
    if (videoRef && outputRef) {
      var video = videoRef;
      console.log(video);
      var output = outputRef;
      var canvas = this.capture(video);
      snapshots.unshift(canvas);
      console.log(snapshots);
      output.innerHTML = "";
      this.state.snapshots.map(snapshot => output.appendChild(snapshot));
    }
  };

  render() {
    return (
      <div className="wrap">
        <video ref={this.videoRef} width={320} controls={true}>
          <source src="http://techslides.com/demos/sample-videos/small.webm" />
        </video>
        <br />
        <button id="cit" onClick={this.shoot} className="button">
          Capture
        </button>
        <br />
        <div ref={this.outputRef} />
      </div>
    );
  }
}
