import React, { Component } from "react";
// import movie from "./movie.mp4";
import subtitles from "./subtitles.vtt";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
// import vttParser from "./VTTParser.js";
// import testVTTJson from "./testVTTScript.json";
// import webvtt from "node-webvtt";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playerSource: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
    };
  }

  componentDidMount() {
    // const parsed = webvtt.parse(vttParser(testVTTJson));

    /// updates track as video loads
    this.refs.player.video.video.addEventListener(
      "loadedmetadata",
      function() {
        // We can't dynamically load <tracks> for subtitles, so we have to hook into the onload of the video...
        let track = document.createElement("track");
        track.kind = "captions";
        track.label = "English";
        track.srclang = "en";
        track.src = subtitles;
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
        >
          <source src={this.state.playerSource} />
          <ControlBar autoHide={true} />
          <track
            kind="captions"
            srcLang="en-US"
            label="English"
            default
            src={""}
          />
        </Player>
      </div>
    );
  }
}
