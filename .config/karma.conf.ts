import "core-js/stable";
import "regenerator-runtime/runtime";
import { Config } from "karma";

import * as basic from "./config";

const browsers = ["ChromeHeadless"];

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...{ browsers },
  });
