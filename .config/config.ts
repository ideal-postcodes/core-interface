/**
 * Basic karma configuration shared between headless and browserstack
 * environments
 */

export const frameworks = ["mocha", "karma-typescript", "polyfill"];

export const preprocessors = {
  "**/*.ts": ["karma-typescript"],
};

export const karmaTypescriptConfig = { 
  bundlerOptions: {
    exclude: [
      "@ideal-postcodes/api-typings"
    ]
  }
}

export const files = [{ pattern: "lib/**/*.ts" }, { pattern: "test/**/*.ts" }];

export const reporters = ["dots", "karma-typescript"];

export const singleRun = true;

export const polyfill = ["Promise"];

export const basePath = "../";
