import React, { Component } from "react";

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <video
          key={this.props.playerSource}
          id="video"
          width={300}
          ref="player"
          muted={true}
          autoPlay={true}
          loop
          crossOrigin="anonymous"
          src={this.props.playerSource}
        >
          <track
            kind="captions"
            srcLang="en-US"
            label="English"
            default
            src={this.props.subs}
          />
        </video>
      </div>
    );
  }
}
