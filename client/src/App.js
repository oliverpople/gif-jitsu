import React, { Component } from "react";
import movie from "./movie.mp4";
import { compile } from "node-webvtt";
import VideoPlayer from "./VideoPlayer";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderVideoWithSubInputs = this.renderVideoWithSubInputs.bind(this);
    this.compileJsonSubtitleInput = this.compileJsonSubtitleInput.bind(this);

    this.state = {
      playerSource: movie,
      subs: "",
      value: "",
      inputJson: {},
      submitted: false
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit = async event => {
    event.preventDefault();
    const inputJson = {
      valid: true,
      cues: [
        {
          identifier: "",
          start: 0,
          end: 10,
          text: this.state.value,
          styles: ""
        }
      ]
    };
    await this.setState({ inputJson });
    await this.compileJsonSubtitleInput();
    this.setState({ submitted: true });
  };

  renderVideoWithSubInputs() {
    if (this.state.submitted) {
      return <VideoPlayer playerSource={movie} subs={this.state.subs} />;
    }
  }

  async compileJsonSubtitleInput() {
    const subtitleText = compile(this.state.inputJson);
    const file = new Blob([subtitleText], { type: "html/txt" });
    const fileURL = URL.createObjectURL(file);
    this.setState({ subs: fileURL });
  }

  render() {
    return (
      <div>
        {this.renderVideoWithSubInputs()}
        <form onSubmit={this.handleSubmit}>
          <label>
            Caption text:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
