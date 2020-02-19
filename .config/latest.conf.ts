import "babel-polyfill";
import { sauceConfig } from "./conf.browser";
import {
  latestMobile,
  latestDesktop,
} from "@ideal-postcodes/supported-browsers";

const customLaunchers = { ...latestMobile, ...latestDesktop };

module.exports = (config: any): void =>
  config.set({
    ...sauceConfig,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
