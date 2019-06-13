import React, { Component } from "react";
import VideoSnapper from "./VideoSnapper";
import Form from "./Form";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      videoFileIdsArray: [],
      subs: {},
      YTUrl: ""
    };
  }

  setSubtitlesWithForm = async subs => {
    await this.setState({ subs });
  };

  setYTUrlWithForm = async YTUrl => {
    await this.setState({ YTUrl });
  };

  convertURLToMP4andStoreOnDb = async () => {
    axios
      .post("http://localhost:4000/mongodb/convertURLToMP4andStoreOnDb", {
        YTUrl: this.state.YTUrl
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Video added the database!");
        }
      })
      .catch(error => console.log(error));
  };

  // Rendering mp4
  getAllVideoFileIdsFromDb = async () => {
    fetch("http://localhost:4000/mongodb/getAllVideoFileIds")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var reformattedVideoFileIdsArray = this.convertArrayOfObjectsToArray(
          data.videoFileIdsArray
        );
        this.setState({ videoFileIdsArray: reformattedVideoFileIdsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  videoList = () => {
    const videoList = this.state.videoFileIdsArray.map(fileId => (
      <li key={fileId} style={{ listStyleType: "none" }}>
        <VideoSnapper fileId={fileId} />
      </li>
    ));

    return <ul>{videoList}</ul>;
  };

  // Rendering gifs
  getAllGifFileIdsFromDb = async () => {
    fetch("http://localhost:4000/mongodb/getAllGifFileIdsFromDb")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var reformattedGifFileIdsArray = this.convertArrayOfObjectsToArray(
          data.gifFileIdsArray
        );
        this.setState({ gifFileIdsArray: reformattedGifFileIdsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  convertArrayOfObjectsToArray = arrayOfObjects => {
    var twoDimArray = arrayOfObjects.map(function(obj) {
      return Object.keys(obj)
        .sort()
        .map(function(key) {
          return obj[key];
        });
    });
    var oneDimArray = [].concat(...twoDimArray);
    return oneDimArray;
  };

  render() {
    return (
      <div>
        <Form
          setYTUrlWithForm={this.setYTUrlWithForm}
          setSubtitlesWithForm={this.setSubtitlesWithForm}
        />
        <button onClick={this.convertURLToMP4andStoreOnDb}>
          Convert YouTube url to MP3 and store on db.
        </button>
        <button onClick={this.getAllVideoFileIdsFromDb}>
          Get ids of all video files stored on db
        </button>
        {this.state.videoFileIdsArray ? this.videoList() : <div />}
      </div>
    );
  }
}
