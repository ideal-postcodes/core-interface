import "babel-polyfill";
import * as basic from "./config";
import { getBrowsers } from "./conf.browser";

const customLaunchers = getBrowsers("core-interface-latest", {
  legacy: true,
  // browserName: "Chrome",
});

module.exports = (config: any): void =>
  config.set({
    ...basic,
    plugins: [
      "karma-mocha",
      "karma-typescript",
      "karma-polyfill",
      "karma-cbt-launcher",
    ],
    cbtConfig: {},
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
