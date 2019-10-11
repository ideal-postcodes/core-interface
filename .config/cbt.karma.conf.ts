import "babel-polyfill";
import * as basic from "./config";
import { getBrowsers } from './conf.browser';

const customLaunchers = getBrowsers();
const cbtConfig = {
  username: "accounts@ideal-postcodes.co.uk",
  authkey: "ub5c4c078253d60b",
}

module.exports = (config: any): void =>
  config.set({
    logLevel: config.LOG_DEBUG,
    ...basic,
    plugins: [
      "karma-mocha",
      "karma-typescript",
      "karma-polyfill",
      "karma-cbt-launcher",
    ],
    cbtConfig,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
