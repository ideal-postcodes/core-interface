/**
 * Basic karma configuration shared between headless and browserstack
 * environments
 */

import { config as dotenv } from "dotenv";
dotenv();

export const frameworks = ["mocha", "karma-typescript"];

export const preprocessors = {
  "**/*.ts": ["karma-typescript"],
};

export const karmaTypescriptConfig = {
  compilerOptions: {
    target: "ES3",
  },
  bundlerOptions: {
    exclude: ["@ideal-postcodes/api-typings"],
    transforms: [require("karma-typescript-es6-transform")()],
  },
};

export const files = [
  "node_modules/@babel/polyfill/dist/polyfill.js",
  { pattern: "lib/**/*.ts" },
  { pattern: "test/**/*.ts" },
];

export const reporters = ["dots", "karma-typescript"];

export const singleRun = true;

export const basePath = "../";

export const concurrency = 1;
