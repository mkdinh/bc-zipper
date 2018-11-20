const config = require("./config/config.json");
const Prompt = require("./lib/Prompt");

const prompt = new Prompt();

prompt.init(config);
