import { compile } from "node-webvtt";
const fs = require("fs-extra");

export default async function vtt(subtitleJSON) {
  const subtitleText = compile(subtitleJSON);
  const vttFile = await fs.writeFile("subtitles.vtt", subtitleText, "UTF-8");
  return vttFile;
}
