import React, { Component } from "react";

export default class VideoPlayer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      playerSource: null,
      videoMetaDataSubs: {}
    };
  }

  componentWillMount() {
    this.getUrlStreamForVideoWithId(this.props.fileId);
    this.getSubsForVideoWithId(this.props.fileId);
  }

  getUrlStreamForVideoWithId = async id => {
    fetch("http://localhost:4000/mongodb/getUrlStreamForVideoWithId", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
      .then(re => re.blob())
      .then(blob => URL.createObjectURL(blob))
      .then(url => {
        this.setState({ playerSource: url });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getSubsForVideoWithId = async id => {
    fetch("http://localhost:4000/mongodb/getSubsForVideoWithId", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ videoMetaDataSubs: json.metadata.inputSubsJson });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        {this.state.playerSource ? (
          <video
            key={this.props.playerSource}
            id="video"
            width={300}
            ref="player"
            muted={true}
            autoPlay={true}
            loop
            src={this.state.playerSource}
          >
            <track
              kind="captions"
              srcLang="en-US"
              label="English"
              default
              src={this.props.subs}
            />
          </video>
        ) : (
          <div />
        )}
      </div>
    );
  }
}
