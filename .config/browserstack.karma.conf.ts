import { hostname } from "os";
import { Config } from "karma";

import * as basic from "./config";

const LATEST_BROWSERS = {
  "Chrome-74.0-windows": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "74",
    os: "Windows",
    os_version: "10",
  },
  "Firefox-66.0-windows": {
    base: "BrowserStack",
    browser: "Firefox",
    browser_version: "66.0",
    os: "Windows",
    os_version: "10",
  },
  "Chrome-74.0-macos": {
    base: "BrowserStack",
    browser: "Chrome",
    browser_version: "74",
    os: "OS X",
    os_version: "Mojave",
  },
  "Firefox-66.0-macos": {
    base: "BrowserStack",
    browser: "Firefox",
    browser_version: "66.0",
    os: "OS X",
    os_version: "Mojave",
  },
  "Safari-12.1": {
    base: "BrowserStack",
    browser: "Safari",
    browser_version: "12.0",
    os: "OS X",
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
  "Opera-58.0": {
    base: "BrowserStack",
    browser: "Opera",
    browser_version: "58",
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
  "Android-4": {
		base: "BrowserStack",
		browserName: "android",
		platform: "ANDROID",
		os: "android",
		os_version: "4.0",
		device: "Google Nexus"
	},
	"ios-5.1": {
		base: "BrowserStack",
		browserName: "iPhone",
		platform: "MAC",
		os: "ios",
		os_version: "5.1",
		device: "iPhone 4S"
	}	,
  "Edge-14": {
    base: "BrowserStack",
    browser: "Edge",
    browser_version: "15",
    os: "Windows",
    os_version: "10",
  },
};

const browsers = [
  ...Object.keys(LATEST_BROWSERS),
  ...Object.keys(OLDEST_BROWSERS),
];

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

  browsers,
};

module.exports = (config: Config): void =>
  config.set({
    ...basic,
    ...browserStack,
  });
