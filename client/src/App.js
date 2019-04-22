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
      subtitleText: "",
      startTime: "",
      endTime: "",
      inputJson: {},
      submitted: false
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = async event => {
    event.preventDefault();
    const inputJson = {
      valid: true,
      cues: [
        {
          identifier: "",
          start: this.state.startTime,
          end: this.state.endTime,
          text: this.state.subtitleText,
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
            Subtitle text:
            <input
              name="subtitleText"
              type="text"
              value={this.state.subtitleText}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Start time:
            <input
              name="startTime"
              type="text"
              value={this.state.startTime}
              onChange={this.handleChange}
            />
          </label>
          <label>
            End time:
            <input
              name="endTime"
              type="text"
              value={this.state.endTime}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
