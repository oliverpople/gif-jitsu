import React, { Component } from "react";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import Form from "./Form";
import DbHandler from "./DbHandler";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitlesWithForm = this.setSubtitlesWithForm.bind(this);
    this.setYTUrlWithForm = this.setYTUrlWithForm.bind(this);
    this.convertURLToMP4OnDb = this.convertURLToMP4OnDb.bind(this);
    this.getUrlStreamForMostRecentMP4OnDb = this.getUrlStreamForMostRecentMP4OnDb.bind(
      this
    );

    this.state = {
      fileIdsArray: [],
      playerSourceArray: [
        "http://media.w3.org/2010/05/sintel/trailer.mp4",
        "http://media.w3.org/2010/05/bunny/trailer.mp4",
        "http://media.w3.org/2010/05/bunny/movie.mp4"
      ],
      playerSource: null,
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

  async getUrlStreamForMostRecentMP4OnDb() {
    fetch("http://localhost:4000/ytdl/streamMP4")
      .then(re => re.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        this.setState({ playerSource: url });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getAllVideoFileIdsFromDb = async () => {
    fetch("http://localhost:4000/ytdl/getAllVideoFileIds")
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({ fileIdsArray: data.fileIdsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  videoList = () => {
    const videoList = this.state.playerSourceArray.map(playerSource => (
      <li key={playerSource}>
        <VideoPlayer
          playerSource={playerSource}
          subs={this.state.compiledSubs}
        />
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
        <button onClick={this.getUrlStreamForMostRecentMP4OnDb}>
          Get url stream for most recent mp4 from db.
        </button>
        {this.state.playerSource ? (
          <VideoPlayer
            key={this.state.playerSource}
            playerSource={this.state.playerSource}
            subs={this.state.compiledSubs}
          />
        ) : (
          <div />
        )}
        <button onClick={this.getAllVideoFileIdsFromDb}>
          Get ids of all video files stored on db
        </button>
        {this.state.playerSourceArray ? this.videoList() : <div />}
      </div>
    );
  }
}
