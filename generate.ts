import { buildSetup, createFiles, createMetaData } from "./src/main";
import { defaultEdition } from "./src/config";
const myArgs = process.argv.slice(2);
const edition = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;

(() => {
  buildSetup();
  createFiles(edition);
  createMetaData();
})();

