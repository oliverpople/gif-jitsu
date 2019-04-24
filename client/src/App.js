import React, { Component } from "react";
import movie from "./movie.mp4";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import SubtitleForm from "./SubtitleForm";
import DbHandler from "./DbHandler";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitles = this.setSubtitles.bind(this);
    this.convertURLToMP4 = this.convertURLToMP4.bind(this);
    this.renderVideoWithSubInputs = this.renderVideoWithSubInputs.bind(this);

    this.state = {
      playerSource: "",
      compiledSubs: "",
      inputJson: {},
      YTUrl: ""
    };
  }

  async setSubtitles(inputJson) {
    await this.setState({ inputJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputJson);
    this.setState({ compiledSubs });
  }

  async convertURLToMP4(YTUrl) {
    await this.setState({ YTUrl });
    axios.post("http://localhost:4000/ytdl/convertURLToMP4", {
      YTUrl: this.state.YTUrl
    });
    this.streamMP4();
  }

  streamMP4 = async () => {
    fetch("http://localhost:4000/ytdl/streamMP4", {
      method: "GET"
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

  renderVideoWithSubInputs() {
    if (
      this.state.inputJson.hasOwnProperty("valid") &&
      this.state.playerSource !== ""
    ) {
      return (
        <VideoPlayer
          playerSource={this.state.playerSource}
          subs={this.state.compiledSubs}
        />
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderVideoWithSubInputs()}
        <SubtitleForm
          convertURLToMP4={this.convertURLToMP4}
          setSubtitles={this.setSubtitles}
        />
        <DbHandler />
      </div>
    );
  }
}
