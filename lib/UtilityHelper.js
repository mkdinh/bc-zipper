const path = require("path");
const fse = require("fs-extra");
const File = require("./File");

class Utils {
  constructor() {
    this.currentPath = "";
    this.rootPath = "";
  }

  async getWeekDirs() {
    const weekDirs = await fse.readdir(this.currentPath);
    return weekDirs.filter(x => !x.match(/readme/i));
  }

  async getDayDirs(week) {
    this.streamPath(week);
    const dayDirs = await fse.readdir(this.currentPath);
    return dayDirs.filter(x => parseInt(x));
  }

  resolveCurrentDay(day) {
    var numDay = parseInt(day);

    if (!numDay) throw new Error("Invalid currentDay input!", day);

    if (numDay > 3) throw new Error("currentDay cannot be greater than 3", day);

    return numDay.toString();
  }

  resolveWeekDir(week, dirArray) {
    return dirArray.filter(x => x.match(week))[0];
  }

  resolveDayDir(day, dirArray) {
    return dirArray.filter(x => x === day)[0];
  }

  resolveOutputDir(week, day) {
    return `${process.cwd()}/output/${week}-activities-0${day}.zip`;
  }

  setRootPath(root) {
    this.currentPath = root;
    this.rootPath = root;
  }

  streamPath(relPath) {
    return (this.currentPath = path.join(this.currentPath, relPath));
  }

  async createFile(absPath) {
    const file = new File(absPath, this.rootPath);

    await file.readContent();

    return file;
  }
}

module.exports = Utils;
