import {
  Browser,
  browsers,
  CbtLauncher,
  toCbtLaunchers,
} from "@ideal-postcodes/supported-browsers";
import { execSync } from "child_process";
import { config } from "dotenv";
config();

const gitSha = execSync("git rev-parse --short HEAD")
  .toString()
  .trim();
const build = `${gitSha}-${new Date().toJSON()}`;

interface Includes extends Partial<Browser> {}

const includeBrowser = (includes: Includes): Record<string, Browser> => {
  const result: Record<string, Browser> = {};
  Object.entries(browsers).forEach(([key, browser]) => {
    for (const attr in includes) {
      if (browser[attr as keyof Browser] === includes[attr as keyof Browser])
        result[key] = browser;
    }
  });
  return result;
};

export const getBrowsers = (
  name: string,
  includes?: Includes
): Record<string, CbtLauncher> => {
  const testBrowsers =
    includes === undefined ? browsers : includeBrowser(includes);
  return toCbtLaunchers(testBrowsers, { name, build });
};
