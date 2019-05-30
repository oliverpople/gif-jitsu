import React, { Component } from "react";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import Form from "./Form";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      fileIdsArray: [],
      compiledSubs: "",
      inputSubsJson: {},
      YTUrl: ""
    };
  }

  setSubtitlesWithForm = async inputSubsJson => {
    await this.setState({ inputSubsJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputSubsJson);
    this.setState({ compiledSubs });
  };

  setYTUrlWithForm = async YTUrl => {
    await this.setState({ YTUrl });
  };

  convertURLToMP4OnDb = async () => {
    axios
      .post("http://localhost:4000/mongodb/convertURLToMP4WithSubsMetaData", {
        YTUrl: this.state.YTUrl,
        inputSubsJson: this.state.inputSubsJson
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
        <VideoPlayer fileId={fileId} subs={this.state.compiledSubs} />
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
        <button onClick={this.convertURLToMP4OnDb}>
          Convert YouTube url to MP3 and store on db.
        </button>
        <button onClick={this.getAllVideoFileIdsFromDb}>
          Get ids of all video files stored on db
        </button>
        {this.state.fileIdsArray ? this.videoList() : <div />}
      </div>
    );
  }
}
