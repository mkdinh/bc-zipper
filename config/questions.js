const fse = require("fs-extra");

module.exports = {
  askSource: () => [
    {
      name: "getSource",
      type: "confirm",
      message: "root directory for repo is not found, do you want to set one?",
    },
  ],

  getSource: () => [
    {
      name: "source",
      type: "input",
      message: "absolute path to repo:",
      default: true,
      validate: async answer => {
        answer = answer.replace(/\s+/g, "");
        const isExist = await fse.exists(answer);

        if (!isExist) {
          return "directory does not exists!";
        }

        return true;
      },
    },
  ],

  getWeeks: weeks => [
    {
      name: "week",
      message: "Select Week:",
      type: "list",
      choices: weeks,
      pageSize: 10,
    },
  ],

  getDays: days => [
    {
      name: "day",
      message: "Select Day:",
      type: "list",
      choices: [...days, "Return"],
    },
  ],

  getSolved: () => [
    {
      name: "solved",
      message: "Include 'Solved' folder?",
      type: "confirm",
      default: false,
    },
  ],
};
