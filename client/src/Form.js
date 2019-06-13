import React, { Component } from "react";

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      YTUrl: "",
      subs: ""
    };
  }

  handleChange(event) {
    if (event.target.name === "YTUrl") {
      this.setState({ YTUrl: event.target.value });
    }
    if (event.target.name === "subs") {
      this.setState({ subs: event.target.value });
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.props.setSubtitlesWithForm(this.state.subs);
    this.props.setYTUrlWithForm(this.state.YTUrl);
  };

  render() {
    let { YTUrl, subs } = this.state;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            YouTube URL:
            <input
              name="YTUrl"
              type="text"
              value={YTUrl}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Subtitle text:
            <input
              name="subs"
              type="text"
              value={subs}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
