import React, { Component } from "react";

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      YTUrl: "",
      inputJson: {
        valid: true,
        cues: [
          {
            identifier: "",
            start: "",
            end: "",
            text: "",
            styles: ""
          }
        ]
      }
    };
  }

  handleChange(event) {
    if (event.target.name === "YTUrl") {
      this.setState({ YTUrl: event.target.value });
    } else {
      var nestedStateProperties = { ...this.state.inputJson };
      nestedStateProperties.cues[0][event.target.name] = event.target.value;
      this.setState({ inputJson: nestedStateProperties });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.props.setSubtitles(this.state.inputJson);
    this.props.convertURLToMP4Stream(this.state.YTUrl);
  };

  render() {
    let stateProp = this.state.inputJson.cues[0];

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            YouTube URL:
            <input
              name="YTUrl"
              type="text"
              value={this.state.YTUrl}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Subtitle text:
            <input
              name="text"
              type="text"
              value={stateProp.text}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Start time:
            <input
              name="start"
              type="text"
              value={stateProp.start}
              onChange={this.handleChange}
            />
          </label>
          <label>
            End time:
            <input
              name="end"
              type="end"
              value={stateProp.end}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
