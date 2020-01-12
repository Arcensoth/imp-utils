import fs = require("fs");
import path = require("path");
import readlineSync = require("readline-sync");
import minimist = require("minimist");

import { DatapackModule, DatapackModuleProperties } from "./datapack-module";
import {
  makePackMcMeta,
  makeManagementFunction,
  makeManagementTag
} from "./utils";

interface Args {
  help: boolean;
  datapack: string;
  yes: boolean;
  no: boolean;
}

function printHelp() {
  console.log("> npm run cli -- -d <datapack> [--y] [--n]");
}

const args: Args = (minimist(process.argv.slice(2), {
  boolean: true,
  alias: { d: "datapack", y: "yes", n: "no" }
}) as any) as Args;

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.datapack) {
  console.error("Datapack root directory is required");
  printHelp();
  process.exit(1);
}

const datapackPath = path.resolve(args.datapack);

console.log("Using datapack root:", datapackPath);

const moduleJson: DatapackModuleProperties = JSON.parse(
  fs.readFileSync(path.join(datapackPath, ".module.json"), "utf8")
);

const datapackModule = DatapackModule.fromObject(moduleJson);

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

// pack.mcmeta
const packMcmetaPath = path.join(datapackPath, "pack.mcmeta");
if (
  args.yes ||
  !fs.existsSync(packMcmetaPath) ||
  (!args.no && readlineSync.keyInYN("Overwrite existing pack.mcmeta?"))
) {
  console.log("Generating pack.mcmeta at:", packMcmetaPath);
  const packMcmeta = makePackMcMeta(datapackModule);
  fs.writeFileSync(packMcmetaPath, packMcmeta);
} else {
  console.log("Skipped pack.mcmeta");
}

console.log('All done!')
