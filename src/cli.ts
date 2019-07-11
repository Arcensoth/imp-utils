import fs = require("fs");
import path = require("path");

import { DatapackModule } from "./datapack-module";
import {
  makePackMcMeta,
  makeManagementFunction,
  makeManagementTag
} from "./utils";

if (process.argv.length < 3) {
  console.error("You must provide a datapack root");
  process.exit(1);
}

const datapackPath = path.resolve(process.argv[2]);

console.log("Using datapack root:", datapackPath);

const moduleJson = JSON.parse(
  fs.readFileSync(path.join(datapackPath, ".module.json"), "utf8")
);

const datapackModule = DatapackModule.fromObject(moduleJson);

// pack.mcmeta
const packMcmetaPath = path.join(datapackPath, "pack.mcmeta");
console.log("Generating pack.mcmeta at:", packMcmetaPath);
const packMcmeta = makePackMcMeta(datapackModule);
fs.writeFileSync(packMcmetaPath, packMcmeta);

// management function
const managementFunctionPath = path.join(
  datapackPath,
  "data",
  datapackModule.namespace,
  "functions",
  `${datapackModule.manageFunction}.mcfunction`
);
console.log("Generating management function at:", managementFunctionPath);
const managementFunction = makeManagementFunction(datapackModule);
fs.writeFileSync(managementFunctionPath, managementFunction);

// management tag
const managementTagPath = path.join(
  datapackPath,
  "data",
  "imp",
  "tags",
  "functions",
  "manage.json"
);
console.log("Generating management tag at:", managementTagPath);
const managementTag = makeManagementTag(datapackModule);
fs.writeFileSync(managementTagPath, managementTag);
