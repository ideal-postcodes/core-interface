/**
 * Basic karma configuration shared between headless and browserstack
 * environments
 */

export const frameworks = ["mocha", "karma-typescript"];

export const preprocessors = {
  "**/*.ts": ["karma-typescript"],
};

export const files = [{ pattern: "lib/**/*.ts" }, { pattern: "test/**/*.ts" }];

export const reporters = ["dots", "karma-typescript"];

export const singleRun = true;
