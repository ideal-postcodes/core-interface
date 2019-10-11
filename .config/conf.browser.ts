import { Browser, browsers } from '@ideal-postcodes/supported-browsers'
import { version } from '../package.json';

export interface ConfBrowser extends Browser {
  base: string,
  build: string,
  name: string,
  screenResolution?: string
}

const customLaunchers: Record<string, ConfBrowser> = {};

export const getBrowsers = () => {
  Object.entries(browsers).forEach(([key, browser]) => {
    if(browser.mobile) {
      customLaunchers[key] = {
        name: 'core-interface-test',
        build: version,
        base: "CrossBrowserTesting",
        browserName: browser.browserName,
        deviceName: browser.deviceName,
        platformVersion: browser.platformVersion,
        platformName: browser.platformName,
        deviceOrientation: browser.deviceOrientation
      }
    } else {
      customLaunchers[key] = {
        name: 'core-interface-test',
        build: version,
        base: "CrossBrowserTesting",
        browserName: browser.browserName,
        version: browser.version,
        platform: browser.platform,
        screenResolution: '1366x768'
      }
    }
  })
  
  return customLaunchers;
}
