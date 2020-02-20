import { execSync } from "child_process";
import * as basic from "./config";
import { config } from "dotenv";
config();

/**
 * Return true if CI environment (Github actions) detected
 */
export const ci: boolean = process.env.GITHUB_ACTION !== undefined;

const { GITHUB_RUN_ID } = process.env;

const gitSha = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

/**
 * Build ID
 *
 * Use gitsha and date if local
 *
 * Use Github action ID if CI
 */
export const build = ci
  ? `${GITHUB_RUN_ID}`
  : `${gitSha}-${new Date().toJSON()}`;

export const reporters = [...basic.reporters, "saucelabs"];

export const plugins = [
  "karma-mocha",
  "karma-typescript",
  "karma-polyfill",
  "karma-sauce-launcher",
];

export const sauceLabs = {
  // Disable if CI
  startConnect: true,
  build,
  testName: "Core-Interface",
  recordVideo: false,
  recordScreenshots: false,
  public: "public restricted",
};

export const tolerance = {
  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 2,
  browserNoActivityTimeout: 30000,
  captureTimeout: 0,
};

export const sauceConfig = {
  ...basic,
  reporters,
  plugins,
  ...tolerance,
  transports: ["websocket", "polling"],
  sauceLabs,
};
