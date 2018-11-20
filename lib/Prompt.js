const fse = require("fs-extra");
const inquirer = require("inquirer");
const Utils = require("./UtilityHelper");
const questions = require("../config/questions");
const clear = require("clear");
const path = require("path");
const FileReader = require("./FileReader");

const utils = new Utils();

class Prompt {
  constructor() {
    this.config = {};
    this.seperators = 30;
  }

  async init(config) {
    clear();
    this.config = config;

    if (!config.source.root) {
      const answer = await this.askSource();
      if (answer.getSource) {
        await this.getSource();
      }
    } else {
      utils.setRootPath(config.source.root);
      await this.getWeeks();
    }
  }

  async askSource() {
    return inquirer.prompt(questions.askSource());
  }

  async getSource() {
    const answer = await inquirer.prompt(questions.getSource());

    if (answer.source) {
      this.config.source.root = answer.source;

      const configFilePath = path.join(__dirname, "../config/config.json");

      await fse.writeFile(configFilePath, JSON.stringify(this.config, null, 2));

      utils.setRootPath(answer.source);

      await this.getWeeks();
    }
  }

  async getWeeks() {
    const weekDirs = await utils.getWeekDirs();

    const answer = await inquirer.prompt(questions.getWeeks(weekDirs));

    this.config.currentWeek = answer.week;

    this.printSeperator();

    await this.getDays();
  }

  async getDays() {
    const dayDirs = await utils.getDayDirs(this.config.currentWeek);

    const answer = await inquirer.prompt(questions.getDays(dayDirs));

    this.config.currentDay = answer.day;

    this.printSeperator();

    await this.getSolved();
  }

  async getSolved() {
    const answer = await inquirer.prompt(questions.getSolved());

    this.config.solved = answer.solved;

    this.printSeperator();

    await this.complete();
  }

  async complete() {
    const fileReader = new FileReader(this.config);

    await fileReader.resolveFiles();
  }

  printSeperator() {
    console.log("=".repeat(this.seperators));
  }
}

module.exports = Prompt;
