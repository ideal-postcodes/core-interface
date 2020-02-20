import "babel-polyfill";
import {
  legacyMobile,
  legacyDesktop,
  config as sauceConfig,
} from "@ideal-postcodes/supported-browsers";
import * as defaults from "./config";

const customLaunchers = { ...legacyMobile, ...legacyDesktop };

module.exports = (config: any): void =>
  config.set({
    ...sauceConfig({ testName: "Core-Interface", defaults }),
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
