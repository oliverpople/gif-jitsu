import React, { Component } from "react";

export default class SubtitleForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
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
    var nestedStateProperties = { ...this.state.inputJson };
    nestedStateProperties.cues[0][event.target.name] = event.target.value;
    this.setState({ inputJson: nestedStateProperties });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.props.setInputJson(this.state.inputJson);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Subtitle text:
            <input
              name="text"
              type="text"
              value={this.state.inputJson.cues[0].text}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Start time:
            <input
              name="start"
              type="text"
              value={this.state.inputJson.cues[0].start}
              onChange={this.handleChange}
            />
          </label>
          <label>
            End time:
            <input
              name="end"
              type="end"
              value={this.state.inputJson.cues[0].end}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
