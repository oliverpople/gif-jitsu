import React, { Component } from "react";
import movie from "./movie.mp4";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
// import testVTTJson from "./testVTTScript.json";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      playerSource: movie,
      subs: "",
      value: "",
      inputJson: {}
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit = event => {
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
    this.setState({ inputJson });
  };

  async componentWillMount() {
    await fetch("http://localhost:4000/vttparser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: this.state.inputJson })
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        const file = new Blob([text], { type: "html/txt" });
        const fileURL = URL.createObjectURL(file);
        this.setState({ subs: fileURL });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <Player
          fluid={false}
          width={300}
          ref="player"
          videoId="video-1"
          muted={true}
          autoPlay={true}
          loop
          crossOrigin="anonymous"
        >
          <source src={this.state.playerSource} />
          <ControlBar autoHide={true} />
          <track
            kind="captions"
            srcLang="en-US"
            label="English"
            default
            src={this.state.subs}
          />
        </Player>
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
