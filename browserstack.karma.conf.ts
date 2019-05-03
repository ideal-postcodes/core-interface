import { Config } from "karma";

import * as basic from "./config";

const browserStack = {
  browserStack: {
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  },

  customLaunchers: {
    bs_iphone5: {
      base: "BrowserStack",
      device: "iPhone 5",
      os: "ios",
      os_version: "6.0",
    },
  },

  browsers: ["bs_iphone5"],
};

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...browserStack,
  });
