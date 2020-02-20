import "babel-polyfill";
import {
  latestMobile,
  latestDesktop,
  config as sauceConfig,
} from "@ideal-postcodes/supported-browsers";
import * as defaults from "./config";

const customLaunchers = { ...latestDesktop, ...latestMobile };

module.exports = (config: any): void =>
  config.set({
    ...sauceConfig({ testName: "Core-Interface", defaults }),
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
