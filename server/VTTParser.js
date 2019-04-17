const fs = require("fs-extra");
const { compile } = require("node-webvtt");
const testVTTJson = require("./testVTTScript.json");

function vtt(subtitleJSON) {
  // const formattedJSON = format(subtitleJSON);
  const subtitleText = compile(subtitleJSON);
  // await fs.writeFile(convertedFilename, subtitleText, "UTF-8");
  // return convertedFilename;
  return subtitleText;
}

console.log(vtt(testVTTJson));

// module.exports = vtt;
