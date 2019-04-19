import React, { Component } from "react";
import movie from "./movie.mp4";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";
import testVTTJson from "./testVTTScript.json";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    // this.getData = this.getData.bind(this);

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
        //Create a Blob from the vtt Stream
        const file = new Blob([text], { type: "html/txt" });
        //Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        //Store a URL in state
        this.setState({ subs: fileURL });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // async getData() {
  //   await fetch("http://localhost:4000/vttparser", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ data: testVTTJson })
  //   })
  //     .then(response => {
  //       return response.text();
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

  // async componentDidMount() {
  //   let self = this;
  //   /// updates track as video loads
  //   this.refs.player.video.video.addEventListener(
  //     "loadedmetadata",
  //     function() {
  //       // We can't dynamically load <tracks> for subtitles, so we have to hook into the onload of the video...
  //       let track = document.createElement("track");
  //       track.kind = "subtitles";
  //       track.label = "English";
  //       track.srclang = "en";
  //       track.src = self.state.subs;
  //       console.log(track.src);
  //       track.addEventListener("load", function() {
  //         this.mode = "showing";
  //         self.refs.player.video.video.textTracks[0].mode = "showing";
  //       });
  //       this.appendChild(track);
  //     },
  //     true
  //   );
  // }

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
