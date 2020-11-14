import minimist = require("minimist");
import { CliArgs, printHelp, processDatapack } from "./helpers";

const args: CliArgs = (minimist(process.argv.slice(2), {
  boolean: true,
  alias: { d: "datapack", y: "yes", n: "no" },
}) as any) as CliArgs;

if (args.help) {
  printHelp();
  process.exit(0);
}

if (!args.datapack) {
  console.error("Datapack root directory is required");
  printHelp();
  process.exit(1);
}

const datapacks = Array.isArray(args.datapack) ? args.datapack : [args.datapack];

for (const datapack of datapacks) {
  try {
    processDatapack(datapack, args.yes, args.no);
  } catch (error) {
    console.error(error);
  }
}
