import fs = require("fs");
import path = require("path");

import { Module } from "./module";
import { makePackMcMeta, makeRegisterMcfunction } from "./utils";

if (process.argv.length < 3) {
  console.error("You must provide a datapack root");
  process.exit(1);
}

const datapackPath = path.resolve(process.argv[2]);

console.log("Using datapack root:", datapackPath);

const module = JSON.parse(
  fs.readFileSync(path.join(datapackPath, ".module.json"), "utf8")
) as Module;

// pack.mcmeta
const packMcmetaPath = path.join(datapackPath, "pack.mcmeta");
console.log("Generating pack.mcmeta at:", packMcmetaPath);
const packMcmeta = makePackMcMeta(module);
fs.writeFileSync(packMcmetaPath, packMcmeta);

// register.mcfunction
const registerMcfunctionPath = path.join(
  datapackPath,
  "data",
  module.namespace,
  "functions",
  ".module",
  "register.mcfunction"
);
console.log("Generating register.mcfunction at:", registerMcfunctionPath);
const registerMcfunction = makeRegisterMcfunction(module);
fs.writeFileSync(registerMcfunctionPath, registerMcfunction);
