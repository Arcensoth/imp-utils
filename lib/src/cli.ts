import fs = require("fs");
import path = require("path");

import { DatapackModule } from "./datapack-module";
import {
  makePackMcMeta,
  makeManageMcfunction,
  makeManageTagJson
} from "./utils";

if (process.argv.length < 3) {
  console.error("You must provide a datapack root");
  process.exit(1);
}

const datapackPath = path.resolve(process.argv[2]);

console.log("Using datapack root:", datapackPath);

const moduleConfig = JSON.parse(
  fs.readFileSync(path.join(datapackPath, ".module.json"), "utf8")
) as DatapackModule;

// pack.mcmeta
const packMcmetaPath = path.join(datapackPath, "pack.mcmeta");
console.log("Generating pack.mcmeta at:", packMcmetaPath);
const packMcmeta = makePackMcMeta(moduleConfig);
fs.writeFileSync(packMcmetaPath, packMcmeta);

// manage.mcfunction
const manageMcfunctionPath = path.join(
  datapackPath,
  "data",
  moduleConfig.namespace,
  "functions",
  ".module",
  "manage.mcfunction"
);
console.log("Generating manage function at:", manageMcfunctionPath);
const manageMcfunction = makeManageMcfunction(moduleConfig);
fs.writeFileSync(manageMcfunctionPath, manageMcfunction);

// manage.json (function tag)
const manageTagJsonPath = path.join(
  datapackPath,
  "data",
  "imp",
  "tags",
  "functions",
  "manage.json"
);
console.log("Generating manage tag at:", manageTagJsonPath);
const manageTagJson = makeManageTagJson(moduleConfig);
fs.writeFileSync(manageTagJsonPath, manageTagJson);
