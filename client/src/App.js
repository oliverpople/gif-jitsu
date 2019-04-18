import React, { Component } from "react";
import movie from "./movie.mp4";
import subtitles from "./subtitles.vtt";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
import vttParser from "./VTTParser.js";
import testVTTJson from "./testVTTScript.json";
// import webvtt from "node-webvtt";

// import fs from "browserify-fs";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playerSource: movie
    };
  }

  async componentDidMount() {
    const subs = "http://localhost:4000/vttparser";
    console.log(subs);

    let self = this;
    /// updates track as video loads
    this.refs.player.video.video.addEventListener(
      "loadedmetadata",
      function() {
        // We can't dynamically load <tracks> for subtitles, so we have to hook into the onload of the video...
        let track = document.createElement("track");
        track.kind = "subtitles";
        track.label = "English";
        track.srclang = "en";
        track.src = subs;
        track.addEventListener("load", function() {
          this.mode = "showing";
          self.refs.player.video.video.textTracks[0].mode = "showing";
        });
        this.appendChild(track);
      },
      true
    );
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
            src=""
          />
        </Player>
      </div>
    );
  }
}
