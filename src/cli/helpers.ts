import fs = require("fs");
import path = require("path");
import readlineSync = require("readline-sync");
import { DatapackModule } from "../lib/models/datapack-module";
import { DatapackModuleDefinition } from "../lib/models/datapack-module-definition";

export interface CliArgs {
  help: boolean;
  datapack: string[];
  yes: boolean;
  no: boolean;
}

export function printHelp() {
  console.log("> npm run cli -- -d <datapack> [--y] [--n]");
}

export function processDatapack(
  datapackLocation: string,
  answerYes: boolean,
  answerNo: boolean
): void {
  const datapackPath = path.resolve(datapackLocation);

  console.log("Processing datapack at:", datapackPath);

  const moduleJson: DatapackModuleDefinition = JSON.parse(
    fs.readFileSync(path.join(datapackPath, ".module.json"), "utf8")
  );

  // assert compatible module format
  if (moduleJson.module_format !== 2) {
    console.error(
      `Skipping incompatible module format ${moduleJson.module_format} for pack: ${datapackPath}`
    );
    return;
  }

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
  const managementFunction = datapackModule.managementFunctionContents;
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
  const managementTag = datapackModule.managementTagContents;
  fs.writeFileSync(managementTagPath, managementTag);

  // pack.mcmeta
  const packMcmetaPath = path.join(datapackPath, "pack.mcmeta");
  if (
    answerYes ||
    !fs.existsSync(packMcmetaPath) ||
    (!answerNo && readlineSync.keyInYN("Overwrite existing pack.mcmeta?"))
  ) {
    console.log("Generating pack.mcmeta at:", packMcmetaPath);
    const packMcmeta = datapackModule.packMcMetaContents;
    fs.writeFileSync(packMcmetaPath, packMcmeta);
  } else {
    console.log("Skipped pack.mcmeta");
  }

  console.log("All done!");
}
