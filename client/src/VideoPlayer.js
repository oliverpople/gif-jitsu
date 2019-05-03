import React, { Component } from "react";
import { Player, ControlBar } from "video-react";
import "video-react/dist/video-react.css";

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);

    // Props not updating after inital render
    console.log(this.props.playerSource);
    console.log(typeof this.props.playerSource);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.playerSource !== prevProps.playerSource) {
      this.refs.player.load();
    }
  }

  componentDidMount() {}

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
          <source src={this.props.playerSource} />
          <ControlBar autoHide={true} />
          <track
            kind="captions"
            srcLang="en-US"
            label="English"
            default
            src={this.props.subs}
          />
        </Player>
      </div>
    );
  }
}
