import React from "react";
import movie from "./movie.mp4";
import subtitles from "./subtitles.vtt";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

export default function App() {
  return (
    <Video
      autoPlay
      loop
      muted
      controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
      poster=""
      onCanPlayThrough={() => {
        // Do stuff
      }}
    >
      <source src={movie} type="video/mp4" />
      <track
        label="English"
        kind="subtitles"
        srcLang="en"
        src={subtitles}
        default
      />
    </Video>
  );
}
