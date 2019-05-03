import { hostname } from "os";
import { Config } from "karma";

import * as basic from "./config";

const LATEST_BROWSERS = {
  "Chrome-74.0": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "74",
    os: "Windows",
    os_version: "10",
  },
  "Safari-iPhone": {
    base: "BrowserStack",
    browserName: "iPhone",
    platform: "MAC",
    device: "iPhone XS",
    os: "iOS",
    os_version: "12.1",
  },
  "Google-Latest": {
    base: "BrowserStack",
    browserName: "android",
    platform: "ANDROID",
    os: "android",
    os_version: "9",
    device: "Pixel 3",
  },
  "Safari-iPad": {
    base: "BrowserStack",
    browserName: "iPad",
    platform: "MAC",
    device: "iPhone 6th",
    os: "iOS",
    os_version: "11.3",
  },
  "Firefox-66.0": {
    base: "BrowserStack",
    browser: "foo",
    browser_version: "bar",
    os: "Windows",
    os_version: "10",
  },
  "Safari-12.1": {
    base: "BrowserStack",
    browser: "Safari",
    browser_version: "12",
    os: "macOS",
    os_version: "Mojave",
  },
  "Edge-18": {
    base: "BrowserStack",
    browser: "Edge",
    browser_version: "18",
    os: "Windows",
    os_version: "10",
  },
};

const OLDEST_BROWSERS = {
  // Oldest Supported
  "IE-11.0": {
    base: "BrowserStack",
    browser: "IE",
    browser_version: "11",
    os: "Windows",
    os_version: "10",
  },
  "Google-5": {
    base: "BrowserStack",
    browserName: "android",
    platform: "ANDROID",
    os: "android",
    os_version: "5",
    device: "Nexus 5",
  },
  "Opera-58.0": {
    base: "BrowserStack",
    browser: "Opera",
    browser_version: "58",
    os: "Windows",
    os_version: "10",
  },
  "Chrome-49.0": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "49",
    os: "Windows",
    os_version: "10",
  },
  "Chrome-61.0": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "61",
    os: "Windows",
    os_version: "10",
  },
  "Chrome-40.0": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "40",
    os: "Windows",
    os_version: "10",
  },
  "Firefox-60.0": {
    base: "BrowserStack",
    browser: "Firefox",
    browser_version: "60",
    os: "Windows",
    os_version: "10",
  },
  "Safari-9.1": {
    base: "BrowserStack",
    browser: "Safari",
    browser_version: "9.1",
    os: "OS X",
    os_version: "El Capitan",
  },
  "Firefox-48.0": {
    base: "BrowserStack",
    browser: "Firefox",
    browser_version: "48",
    os: "Windows",
    os_version: "10",
  },
  "Samsung-5": {
    base: "BrowserStack",
    browserName: "android",
    platform: "ANDROID",
    os: "android",
    os_version: "5",
    device: "Galaxy S6",
  },
  "Edge-14": {
    base: "BrowserStack",
    browser: "Edge",
    browser_version: "15",
    os: "Windows",
    os_version: "10",
  },
};

const browserStack = {
  browserStack: {
    project: "core-interface",
    name: hostname(),
    build: `${new Date().toJSON()}`,
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
  },

  customLaunchers: {
    ...LATEST_BROWSERS,
    ...OLDEST_BROWSERS,
  },

  browsers: [
    // Latest
    "Chrome-74.0",
    "Safari-iPhone",
    "Google-Latest",
    "Safari-iPad",
    "Firefox-66.0",
    "Safari-12.1",
    "Edge-18",

    // Oldest Supported
    "IE-11.0",
    "Google-5",
    "Opera-58.0",
    "Chrome-49.0",
    "Chrome-61.0",
    "Chrome-40.0",
    "Firefox-60.0",
    "Safari-9.1",
    "Firefox-48.0",
    "Samsung-5",
    "Edge-14",
  ],
};

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...browserStack,
  });
