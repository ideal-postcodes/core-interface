import "core-js/stable";
import "regenerator-runtime/runtime";
import { Config } from "karma";
//import { executablePath } from "puppeteer";
//process.env.CHROME_BIN = executablePath();

import * as basic from "./config";

import { readdirSync } from "fs";
import { resolve } from "path";

const path = "../node_modules/puppeteer/.local-chromium/";

const directories = (source:string) =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

process.env.CHROME_BIN = resolve(__dirname, path, directories(resolve(__dirname, path))[0], "chrome-linux", "chrome");

const browsers = ["ChromeHeadlessSand"];
const customLaunchers = {
    ChromeHeadlessSand: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
    }
};

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...{ browsers },
      customLaunchers
  });
