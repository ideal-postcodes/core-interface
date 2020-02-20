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

export const sauceConfig = {
  ...basic,
  reporters: [...basic.reporters, "saucelabs"],
  plugins: [
    "karma-mocha",
    "karma-typescript",
    "karma-polyfill",
    "karma-sauce-launcher",
  ],
  browserDisconnectTimeout: 10000,
  browserDisconnectTolerance: 2,
  browserNoActivityTimeout: 30000,
  captureTimeout: 120000,
  transports: ["websocket", "polling"],
  sauceLabs: {
    startConnect: true,
    build,
    testName: "Core-Interface",
    recordVideo: false,
    recordScreenshots: false,
    public: "public restricted",
  },
};
