const fse = require("fs-extra");
const path = require("path");
const JSZip = require("jszip");
const Utils = require("./UtilityHelper");

const utils = new Utils();

class FileReader {
  constructor(config) {
    this.config = config;
    this.files = [];
    this.path = {
      currentWeek: "",
      currentDay: "",
      activities: "",
    };

    this.config.currentDay = utils.resolveCurrentDay(this.config.currentDay);
    utils.setRootPath(this.config.source.root);
  }

  async resolveFiles() {
    const weekDirArray = await fse.readdir(this.config.source.root);

    const weekPath = utils.resolveWeekDir(
      this.config.currentWeek,
      weekDirArray,
    );

    this.path.currentWeek = utils.streamPath(weekPath);

    const dayDirArray = await fse.readdir(this.path.currentWeek);

    const dayPath = utils.resolveDayDir(this.config.currentDay, dayDirArray);

    this.path.currentDay = utils.streamPath(dayPath);

    this.path.activities = utils.streamPath("Activities");

    const activityArray = await fse.readdir(this.path.activities);

    activityArray.sort();

    for (let i = 0; i < activityArray.length; i++) {
      try {
        const readme = path.join(
          this.path.activities,
          activityArray[i],
          "README.md",
        );

        if (await fse.exists(readme)) {
          let file = await utils.createFile(readme);
          this.files.push(file);
        }

        const unsolved = path.join(
          this.path.activities,
          activityArray[i],
          "Unsolved",
        );

        const files = await fse.readdir(unsolved);

        files.forEach(async filename => {
          const absPath = path.join(unsolved, filename);
          let file = await utils.createFile(absPath);
          this.files.push(file);
        });
      } catch (err) {}
    }

    this.zipFiles(this.files);
  }

  async zipFiles(files) {
    var zip = new JSZip();
    var week = this.config.currentWeek;
    var day = this.config.currentDay;

    files.forEach(file => {
      zip.file(file.relPath, file.content);
    });

    const outputPath = utils.resolveOutputDir(week, day);

    this.genZip(zip, outputPath);
  }

  async genZip(zip, dir) {
    await utils.createOutputDir();

    const content = await zip
      .generateNodeStream({
        type: "nodebuffer",
        streamFiles: true,
      })
      .pipe(fse.createWriteStream(dir))
      .on("finish", () => {
        console.log("COMPLETE!", "\n");
        console.log("output:", "\n", dir);

        if (this.config.openDirectory) utils.openOutputDir();
      });
  }
}

module.exports = FileReader;
