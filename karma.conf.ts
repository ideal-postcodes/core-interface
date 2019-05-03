import { Config } from "karma";
import { executablePath } from "puppeteer";
process.env.CHROME_BIN = executablePath();

import * as basic from "./config";

const browsers = ["ChromeHeadless"];

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...{ browsers },
  });
