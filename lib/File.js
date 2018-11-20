const fse = require("fs-extra");

class File {
  constructor(absPath, root) {
    root = root.replace(/\//g, "\\");

    this.absPath = absPath;

    this.relPath = absPath.replace(`${root}\\`, "");

    this.filename = absPath.split(/\\|\//).pop();

    this.extension = this.filename.split(".").pop();

    this.hidden = this.filename.split(".").length === 1;
  }

  async readContent() {
    if (this.hidden) return;

    const options = {};
    if (this.extension.match(/xls/)) {
      options.type = "binary";
    } else {
      options.type = "utf8";
    }

    this.content = await fse.readFile(this.absPath, options);
  }
}

module.exports = File;
