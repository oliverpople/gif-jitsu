import React, { Component } from "react";
import movie from "./movie.mp4";
import SubtitleCompiler from "./utils/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import SubtitleForm from "./SubtitleForm";
import DbHandler from "./DbHandler";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitles = this.setSubtitles.bind(this);
    this.renderVideoWithSubInputs = this.renderVideoWithSubInputs.bind(this);

    this.state = {
      playerSource: movie,
      compiledSubs: "",
      inputJson: {}
    };
  }

  async setSubtitles(inputJson) {
    await this.setState({ inputJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputJson);
    this.setState({ compiledSubs });
  }

  renderVideoWithSubInputs() {
    if (this.state.inputJson.hasOwnProperty("valid")) {
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
        <SubtitleForm setSubtitles={this.setSubtitles} />
        <DbHandler />
      </div>
    );
  }
}
