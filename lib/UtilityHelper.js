const path = require("path");
const fse = require("fs-extra");
const File = require("./File");
const cp = require("child_process");

class Utils {
  constructor() {
    this.currentPath = "";
    this.rootPath = "";
    this.outputPath = "";
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
    return `${__dirname}/../output/${week}-activities-0${day}.zip`;
  }

  setRootPath(root) {
    this.currentPath = root;
    this.rootPath = root;
  }

  streamPath(relPath) {
    return (this.currentPath = path.join(this.currentPath, relPath));
  }

  popPath() {
    const newPath = this.currentPath.split(/\/|\\/);
    newPath.pop();

    this.currentPath = newPath.join("\\");
    return newPath;
  }

  async createFile(absPath) {
    const file = new File(absPath, this.rootPath);

    await file.readContent();

    return file;
  }

  async createOutputDir() {
    const outputPath = path.join(__dirname, "..", "output");
    this.outputPath = outputPath;
    if (!(await fse.exists(outputPath))) {
      return fse.mkdir(outputPath);
    }
  }

  openOutputDir() {
    var command = "nautilus"; // linux
    var isWin = process.platform === "win32";
    var isMac = process.platform === "darwin";

    if (isWin) {
      command = "explorer"; // windows
    } else if (isMac) {
      command = "open"; // mac
    }

    cp.spawn("explorer", [this.outputPath]);
  }
}

module.exports = Utils;
