import { sauceConfig } from "./conf.browser";
import {
  latestMobile,
  latestDesktop,
} from "@ideal-postcodes/supported-browsers";

const customLaunchers = { ...latestDesktop, ...latestMobile };

module.exports = (config: any): void =>
  config.set({
    ...sauceConfig,
    browsers: Object.keys(customLaunchers),
    customLaunchers,
  });
