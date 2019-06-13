import React, { Component } from "react";

export default class Gif extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      imageSource: null
    };
  }

  componentWillMount() {
    this.getUrlStreamForGifWithId(this.props.fileId);
  }

  getUrlStreamForGifWithId = async id => {
    fetch("http://localhost:4000/mongodb/getUrlStreamForGifWithId", {
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
        this.setState({ imageSource: url });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        {this.state.imageSource ? (
          <img
            key={this.props.fileId}
            alt={"gif"}
            width={320}
            src={this.state.imageSource}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }
}
