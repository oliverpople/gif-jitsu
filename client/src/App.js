import React, { Component } from "react";
import movie from "./movie.mp4";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
import testVTTJson from "./testVTTScript.json";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playerSource: movie,
      subs: ""
    };
  }

  async componentWillMount() {
    await fetch("http://localhost:4000/vttparser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: testVTTJson })
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
      </div>
    );
  }
}
