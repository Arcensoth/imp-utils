import fs = require("fs");
import path = require("path");
import readlineSync = require("readline-sync");

import { DatapackModule, DatapackModuleProperties } from "./datapack-module";

export const TECHNICAL_ITEM = "barrier";

export function makeHoverCardComponent(module: DatapackModule) {
  const components = [
    { text: "", color: "gray" },
    { text: module.title, color: module.color },
    "\n",
    module.description,
    "\n",
    {
      text: `Version ${module.version} for Minecraft ${module.minecraftVersion}`,
      color: "dark_gray",
    },
    "\n",
    "By ",
  ];

  module.authors.forEach((author) => {
    components.push({ text: author.name, color: "yellow" });
    components.push(", ");
  });

  components.pop();

  return components;
}

export function makeClickableTitleComponent(module: DatapackModule) {
  return {
    text: module.title,
    hoverEvent: {
      action: "show_text",
      value: makeHoverCardComponent(module),
    },
    clickEvent: {
      action: "open_url",
      value: module.url,
    },
  };
}

export function makeClickableAuthorsComponent(module: DatapackModule) {
  const components: any[] = [{ text: "", color: "gray" }];

  module.authors.forEach((author) => {
    if (author.url) {
      components.push({
        text: author.name,
        color: "yellow",
        hoverEvent: {
          action: "show_text",
          value: author.url,
        },
        clickEvent: { action: "open_url", value: author.url },
      });
    } else {
      components.push({ text: author.name, color: "yellow" });
    }
    components.push(", ");
  });

  components.pop();

  return components;
}

export function makeManageDispatchCommands(
  module: DatapackModule,
  action: string
): string[] {
  return [
    "data modify storage imp.__temp__:api/v0/manage __input__ " +
      `set value {id:${module.namespace},action:${action}}`,
    "function imp:api/v0/manage",
  ];
}

export function makeManageDispatchCommandsString(
  module: DatapackModule,
  action: string
): string {
  return "['" + makeManageDispatchCommands(module, action).join("','") + "']";
}

export function makeManageButtonCommand(
  module: DatapackModule,
  action: string
): string {
  const buttonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeManageDispatchCommandsString(module, action) +
    "}}";

  console.debug(
    `Length of command for ${action} button: ${buttonCommand.length}`
  );
  console.debug(`    ${buttonCommand}`);

  if (buttonCommand.length > 255) {
    console.warn(`Command for ${action} button exceeds chat command limit`);
  }

  return buttonCommand;
}

export function makeManageButtonComponent(
  module: DatapackModule,
  action: string,
  color: string
): any {
  return {
    text: "",
    hoverEvent: {
      action: "show_text",
      value: [
        { text: "Click to ", color: color },
        { text: action, bold: true },
        " ",
        { text: module.title, color: module.color },
      ],
    },
    clickEvent: {
      action: "run_command",
      value: makeManageButtonCommand(module, action),
    },
  };
}

export function makeRegisterCommands(module: DatapackModule): string[] {
  const registrantNbt = {
    module_format: module.moduleFormat,
    title: module.title,
    color: module.color,
    description: module.description,
    version: module.version,
    minecraft_version: module.minecraftVersion,
    category: module.category,
    namespace: module.namespace,
    scorespace: module.scorespace,
    url: module.url,
    authors: module.authors,
    manage_function: module.manageFunction,
    setup_function: module.setupFunction,
    teardown_function: module.teardownFunction,

    // dependencies
    dependencies: Object.keys(module.dependencies).map((key) => {
      return { id: key, version: module.dependencies[key] };
    }),

    // extras
    version_major: Number(module.version.split(".")[0]),
    version_minor: Number(module.version.split(".")[1]),
    version_patch: Number(module.version.split(".")[2].split("-")[0]),
    version_label: module.version.split("-")[1],

    // text components
    components: {
      title: JSON.stringify(makeClickableTitleComponent(module)),
      authors: JSON.stringify(makeClickableAuthorsComponent(module)),
      color: JSON.stringify({
        text: "",
        color: module.color,
      }),
      enable_button: JSON.stringify(
        makeManageButtonComponent(module, "enable", "green")
      ),
      forget_button: JSON.stringify(
        makeManageButtonComponent(module, "forget", "red")
      ),
      disable_button: JSON.stringify(
        makeManageButtonComponent(module, "disable", "red")
      ),
      uninstall_button: JSON.stringify(
        makeManageButtonComponent(module, "uninstall", "red")
      ),
      reinstall_button: JSON.stringify(
        makeManageButtonComponent(module, "reinstall", "yellow")
      ),
    },

    // command strings
    commands: {
      pause: `function ${module.namespace}:${module.pauseFunction}`,
      resume: `function ${module.namespace}:${module.resumeFunction}`,
      setup: `function ${module.namespace}:${module.setupFunction}`,
      teardown: `function ${module.namespace}:${module.teardownFunction}`,
      enable: [
        `datapack enable "file/${module.namespace}"`,
        `datapack enable "file/${module.namespace}.zip"`,
        `datapack enable "file/${module.namespace}-${module.version}.zip"`,
      ],
      disable: [
        `datapack disable "file/${module.namespace}"`,
        `datapack disable "file/${module.namespace}.zip"`,
        `datapack disable "file/${module.namespace}-${module.version}.zip"`,
      ],
    },
  };

  const execute =
    `execute if data storage imp.__temp__:api/manage ` +
    `__temp__{register: true} run`;

  const commands = [
    "data modify storage imp.__temp__:api/manage __temp__.registrants append value " +
      JSON.stringify(registrantNbt),
  ];

  return commands.map((command) => {
    return `${execute} ${command}`;
  });
}

export function makeInstallCommands(module: DatapackModule): string[] {
  const execute =
    `execute if data storage imp.__temp__:api/manage ` +
    `__temp__{install: [${module.namespace}]} run`;

  const commands = [`function ${module.namespace}:${module.setupFunction}`];

  return commands.map((command) => {
    return `${execute} ${command}`;
  });
}

export function makePackMcMeta(module: DatapackModule) {
  return JSON.stringify({
    pack: {
      pack_format: 6,
      description: makeHoverCardComponent(module),
    },
  });
}

export function makeManagementFunction(module: DatapackModule) {
  return [
    ...makeRegisterCommands(module),
    ...makeInstallCommands(module),
    "",
  ].join("\n");
}

export function makeManagementTag(module: DatapackModule) {
  return JSON.stringify({
    values: [`${module.namespace}:${module.manageFunction}`],
  });
}

export function processDatapack(
  datapackLocation: string,
  answerYes: boolean,
  answerNo: boolean
): void {
  const datapackPath = path.resolve(datapackLocation);

  console.log("Processing datapack at:", datapackPath);

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
    answerYes ||
    !fs.existsSync(packMcmetaPath) ||
    (!answerNo && readlineSync.keyInYN("Overwrite existing pack.mcmeta?"))
  ) {
    console.log("Generating pack.mcmeta at:", packMcmetaPath);
    const packMcmeta = makePackMcMeta(datapackModule);
    fs.writeFileSync(packMcmetaPath, packMcmeta);
  } else {
    console.log("Skipped pack.mcmeta");
  }

  console.log("All done!");
}
