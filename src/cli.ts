import minimist = require("minimist");

import { processDatapack } from "./utils";

interface Args {
  help: boolean;
  datapack: string[];
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

const datapacks = Array.isArray(args.datapack)
  ? args.datapack
  : [args.datapack];

for (const datapack of datapacks) {
  try {
    processDatapack(datapack, args.yes, args.no);
  } catch (error) {
    console.error(error);
  }
}
