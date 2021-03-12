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
    fs.readFileSync(path.join(datapackPath, "module.json"), "utf8")
  );

  const datapackModule = DatapackModule.fromObject(moduleJson);

  // register function
  const registerFunctionPath = path.join(
    datapackPath,
    "data",
    datapackModule.name,
    "functions",
    `${datapackModule.registerFunction}.mcfunction`
  );
  console.log("Generating register function at:", registerFunctionPath);
  const registerFunction = datapackModule.registerFunctionContents;
  fs.writeFileSync(registerFunctionPath, registerFunction);

  // register tag
  const registerTagPath = path.join(
    datapackPath,
    "data",
    "imp",
    "tags",
    "functions",
    "register.json"
  );
  console.log("Generating register tag at:", registerTagPath);
  const registerTag = datapackModule.registerTagContents;
  fs.writeFileSync(registerTagPath, registerTag);

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
