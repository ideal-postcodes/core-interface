import "babel-polyfill";
import { sauceConfig } from "./conf.browser";
import {
  legacyMobile,
  legacyDesktop,
} from "@ideal-postcodes/supported-browsers";

const customLaunchers = { ...legacyMobile, ...legacyDesktop };

module.exports = (config: any): void =>
  config.set({
    ...sauceConfig,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
