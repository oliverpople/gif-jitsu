import React, { Component } from "react";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import Form from "./Form";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitlesWithForm = this.setSubtitlesWithForm.bind(this);
    this.setYTUrlWithForm = this.setYTUrlWithForm.bind(this);
    this.convertURLToMP4OnDb = this.convertURLToMP4OnDb.bind(this);

    this.state = {
      fileIdsArray: [],
      compiledSubs: "",
      inputSubsJson: {},
      YTUrl: ""
    };
  }

  async setSubtitlesWithForm(inputSubsJson) {
    await this.setState({ inputSubsJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputSubsJson);
    this.setState({ compiledSubs });
  }

  async setYTUrlWithForm(YTUrl) {
    await this.setState({ YTUrl });
  }

  async convertURLToMP4OnDb() {
    axios
      .post("http://localhost:4000/ytdl/convertURLToMP4", {
        YTUrl: this.state.YTUrl
      })
      .then(res => {
        if (res.status === 200) {
          console.log("Video added the database!");
        }
      })
      .catch(error => console.log(error));
  }

  getAllVideoFileIdsFromDb = async () => {
    fetch("http://localhost:4000/ytdl/getAllVideoFileIds")
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
      <li key={fileId}>
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
