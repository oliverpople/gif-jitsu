const express = require("express");
const app = express();
const port = 4000;
const gifEncoder = require("./gifify.js");

gifEncoder();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
