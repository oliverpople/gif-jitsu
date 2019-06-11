import React, { Component } from "react";
import GifCreator from "./utils/GifCreator";
import DataURItoBlob from "./utils/dataURLToBlob";
import axios from "axios";

export default class VideoSnapper extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      scaleFactor: 1,
      snapShots: [],
      playerSource: null,
      gifImage: null,
      gifBlob: null
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

  captureFrame = () => {
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

  createGif = async () => {
    let self = this;
    GifCreator(this.state.snapShots, function(result) {
      self.setState({ gifImage: result });
    });
  };

  saveGifToDb = async () => {
    var data = await this.convertImageToBlobAndAppendToFormData();
    axios
      .post("http://localhost:4000/mongodb/addNewGifDataURLToDb", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Gif added to the database!");
        }
      })
      .catch(error => console.log(error));
  };

  convertImageToBlobAndAppendToFormData = async () => {
    var gifBlob = await DataURItoBlob(this.state.gifImage);
    var data = new FormData();
    data.append("data", gifBlob);
    return data;
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
        <button onClick={this.captureFrame} className="button">
          Capture Frame
        </button>
        <br />
        <div id={"output"} />
        <button onClick={this.createGif} className="button">
          Create Gif
        </button>
        <button onClick={this.saveGifToDb} className="button">
          Save Gif
        </button>
        {this.state.gifImage ? (
          <img src={this.state.gifImage} alt="Gif" />
        ) : (
          <div />
        )}
      </div>
    );
  }
}
