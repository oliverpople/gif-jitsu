import React, { Component } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoSnapshotter from "./VideoSnapshotter";
import Form from "./Form";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fileIdsArray: [],
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

  convertURLToMP4OnDbWithSubs = async () => {
    axios
      .post("http://localhost:4000/mongodb/convertURLToMP4WithSubsMetaData", {
        YTUrl: this.state.YTUrl,
        subs: this.state.subs
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Video added the database!");
        }
      })
      .catch(error => console.log(error));
  };

  getAllVideoFileIdsFromDb = async () => {
    fetch("http://localhost:4000/mongodb/getAllVideoFileIds")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var reformattedFileIdsArray = this.convertArrayOfObjectsToArray(
          data.fileIdsArray
        );
        this.setState({ fileIdsArray: reformattedFileIdsArray });
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

  videoList = () => {
    const videoList = this.state.fileIdsArray.map(fileId => (
      <li key={fileId} style={{ listStyleType: "none" }}>
        <VideoPlayer fileId={fileId} />
      </li>
    ));

    return <ul>{videoList}</ul>;
  };

  render() {
    return (
      <div>
        <Form
          setYTUrlWithForm={this.setYTUrlWithForm}
          setSubtitlesWithForm={this.setSubtitlesWithForm}
        />
        <button onClick={this.convertURLToMP4OnDbWithSubs}>
          Convert YouTube url to MP3 and store on db.
        </button>
        <button onClick={this.getAllVideoFileIdsFromDb}>
          Get ids of all video files stored on db
        </button>
        {this.state.fileIdsArray ? this.videoList() : <div />}
        <VideoSnapshotter />
      </div>
    );
  }
}
