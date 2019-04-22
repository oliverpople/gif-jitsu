import React, { Component } from "react";
import movie from "./movie.mp4";
import SubtitleCompiler from "./modules/SubtitleCompiler";
import VideoPlayer from "./VideoPlayer";
import SubtitleForm from "./SubtitleForm";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitleInputJson = this.setSubtitleInputJson.bind(this);
    this.renderVideoWithSubInputs = this.renderVideoWithSubInputs.bind(this);

    this.state = {
      playerSource: movie,
      compiledSubs: "",
      inputJson: {}
    };
  }

  async setSubtitleInputJson(inputJson) {
    await this.setState({ inputJson });
    const compiledSubs = await SubtitleCompiler(this.state.inputJson);
    this.setState({ compiledSubs });
  }

  renderVideoWithSubInputs() {
    if (this.state.inputJson.hasOwnProperty("valid")) {
      return (
        <VideoPlayer playerSource={movie} subs={this.state.compiledSubs} />
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderVideoWithSubInputs()}
        <SubtitleForm setSubtitleInputJson={this.setSubtitleInputJson} />
      </div>
    );
  }
}
