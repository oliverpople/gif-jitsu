import React, { Component } from "react";
import movie from "./movie.mp4";
import { compile } from "node-webvtt";
import VideoPlayer from "./VideoPlayer";
import SubtitleForm from "./SubtitleForm";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.setSubtitleInputJson = this.setSubtitleInputJson.bind(this);
    this.renderVideoWithSubInputs = this.renderVideoWithSubInputs.bind(this);
    this.compileJsonSubtitleInput = this.compileJsonSubtitleInput.bind(this);

    this.state = {
      playerSource: movie,
      compiledSubs: "",
      inputJson: {}
    };
  }

  async setSubtitleInputJson(inputJson) {
    await this.setState({ inputJson });
    await this.compileJsonSubtitleInput();
    this.setState({ submitted: true });
  }

  renderVideoWithSubInputs() {
    if (this.state.inputJson.hasOwnProperty("valid")) {
      return (
        <VideoPlayer playerSource={movie} subs={this.state.compiledSubs} />
      );
    }
  }

  async compileJsonSubtitleInput() {
    const subtitleText = compile(this.state.inputJson);
    const file = new Blob([subtitleText], { type: "html/txt" });
    const fileURL = URL.createObjectURL(file);
    this.setState({ compiledSubs: fileURL });
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
