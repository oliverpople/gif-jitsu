import React, { Component } from "react";
import VideoSnapper from "./VideoSnapper";
import Gif from "./Gif";
import Form from "./Form";
import axios from "axios";
import ConvertArrayOfObjectsToArray from "./utils/ConvertArrayOfObjectsToArray";

export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      videoStream: null,
      gifFileIdsArray: [],
      subs: {},
      YTUrl: ""
    };
  }

  setSubtitlesWithForm = async subs => {
    await this.setState({ subs });
  };

  setYTUrlWithForm = async YTUrl => {
    await this.setState({ YTUrl });
  };

  convertURLToMP4 = async () => {
    axios
      .post("http://localhost:4000/mongodb/convertURLToMP4", {
        YTUrl: this.state.YTUrl
      })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        this.setState({ videoStream: url });
      })
      .catch(error => console.log(error));
  };

  // Rendering mp4
  getAllVideoFileIdsFromDb = async () => {
    fetch("http://localhost:4000/mongodb/getAllVideoFileIdsFromDb")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var reformattedVideoFileIdsArray = ConvertArrayOfObjectsToArray(
          data.videoFileIdsArray
        );
        this.setState({ videoFileIdsArray: reformattedVideoFileIdsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Rendering gifs
  getAllGifFileIdsFromDb = async () => {
    fetch("http://localhost:4000/mongodb/getAllGifFileIdsFromDb")
      .then(res => {
        return res.json();
      })
      .then(data => {
        var reformattedGifFileIdsArray = ConvertArrayOfObjectsToArray(
          data.gifFileIdsArray
        );
        this.setState({ gifFileIdsArray: reformattedGifFileIdsArray });
      })
      .catch(err => {
        console.log(err);
      });
  };

  gifList = () => {
    const gifList = this.state.gifFileIdsArray.map(fileId => (
      <li key={fileId} style={{ listStyleType: "none" }}>
        <Gif fileId={fileId} />
      </li>
    ));

    return <ul>{gifList}</ul>;
  };

  render() {
    return (
      <div>
        <Form
          setYTUrlWithForm={this.setYTUrlWithForm}
          setSubtitlesWithForm={this.setSubtitlesWithForm}
        />
        <button onClick={this.convertURLToMP4}>
          Convert YouTube url to MP3
        </button>
        <button onClick={this.getAllVideoFileIdsFromDb}>
          Render all video files stored on db
        </button>
        <button onClick={this.getAllGifFileIdsFromDb}>
          Render all GIFs files stored on db
        </button>
        {this.state.videoStream ? (
          <VideoSnapper playerSource={this.state.videoStream} />
        ) : (
          <div />
        )}
        {this.state.gifFileIdsArray ? this.gifList() : <div />}
      </div>
    );
  }
}
