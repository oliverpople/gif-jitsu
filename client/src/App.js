import React, { Component } from "react";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import Form from "./Form";
import DbHandler from "./DbHandler";
import axios from "axios";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitles = this.setSubtitles.bind(this);
    this.convertURLToMP4Stream = this.convertURLToMP4Stream.bind(this);
    this.renderVideoWithProps = this.renderVideoWithProps.bind(this);

    this.state = {
      playerSource: "",
      compiledSubs: "",
      inputSubsJson: {},
      YTUrl: ""
    };
  }

  async setSubtitles(inputSubsJson) {
    await this.setState({ inputSubsJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputSubsJson);
    this.setState({ compiledSubs });
  }

  async convertURLToMP4Stream(YTUrl) {
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

  renderVideoWithProps() {
    if (this.state.compiledSubs && this.state.playerSource !== "") {
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
        {this.renderVideoWithProps()}
        <Form
          convertURLToMP4Stream={this.convertURLToMP4Stream}
          setSubtitles={this.setSubtitles}
        />
        {/*<DbHandler /> */}
      </div>
    );
  }
}
