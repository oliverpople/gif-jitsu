import { compile } from "node-webvtt";
const fs = require("browserify-fs");

export default function vtt(subtitleJSON) {
  const subtitleText = compile(subtitleJSON);
  const vttFile = fs.writeFile("./subtitles.vtt", subtitleText, "UTF-8");

  return vttFile;
}
