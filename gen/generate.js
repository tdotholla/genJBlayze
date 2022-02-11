import { defaultEdition } from "./config";
import { buildSetup, createFiles, createMetaData } from "./main";
var myArgs = process.argv.slice(2);
var edition = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;
(function () {
    buildSetup();
    createFiles(edition);
    createMetaData();
})();
