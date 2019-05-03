"use strict";

const frameworks = ["mocha", "karma-typescript"];
const preprocessors = {
  "**/*.ts": ["karma-typescript"],
};
const files = [{ pattern: "lib/**/*.ts" }, { pattern: "test/**/*.ts" }];
const reporters = ["dots", "karma-typescript"];
const browsers = ["ChromeHeadless"];
const singleRun = true;

const karmaConfig = {
  frameworks,
  files,
  preprocessors,
  reporters,
  browsers,
  singleRun,
};

module.exports = config => config.set(karmaConfig);
