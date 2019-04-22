import { compile } from "node-webvtt";

export default async function SubtitleCompiler(inputJson) {
  const subtitleText = await compile(inputJson);
  const file = new Blob([subtitleText], { type: "html/txt" });
  const fileURL = URL.createObjectURL(file);
  return fileURL;
}
