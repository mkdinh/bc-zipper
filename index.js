#!/usr/bin/env node

const config = require("./config/config.json");
const Prompt = require("./lib/Prompt");
const figlet = require("figlet");

const prompt = new Prompt();

figlet("BC Zipper", (err, str) => {
  if (err) throw err;

  config.title = str;

  prompt.init(config);
});
