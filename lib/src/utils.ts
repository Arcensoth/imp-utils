import { DatapackModule } from "./datapack-module";

export const TECHNICAL_ITEM = "barrier";

export function makeHoverCardComponent(module: DatapackModule) {
  const components = [
    { text: "", color: "gray" },
    { text: module.title, color: module.color },
    "\n",
    module.description,
    "\n",
    {
      text: `${module.version} for Minecraft ${module.minecraft_version}`,
      color: "dark_gray"
    },
    "\n",
    "By "
  ];

  module.authors.forEach(author => {
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
      value: makeHoverCardComponent(module)
    },
    clickEvent: {
      action: "open_url",
      value: module.url
    }
  };
}

export function makeClickableAuthorsComponent(module: DatapackModule) {
  const components: any[] = [{ text: "", color: "gray" }];

  module.authors.forEach(author => {
    if (author.url) {
      components.push({
        text: author.name,
        color: "yellow",
        hoverEvent: {
          action: "show_text",
          value: author.url
        },
        clickEvent: { action: "open_url", value: author.url }
      });
    } else {
      components.push({ text: author.name, color: "yellow" });
    }
    components.push(", ");
  });

  components.pop();

  return components;
}

export function makePackMcMeta(module: DatapackModule) {
  return JSON.stringify({
    pack: {
      pack_format: 1,
      description: makeHoverCardComponent(module)
    }
  });
}

export function makeEnableDispatchCommands(module: DatapackModule): string[] {
  return [
    "execute as d-e-a-d-beef run data modify entity @s Item.tag.__args__.imp.manage.entry " +
      `set from entity @s Item.tag.imp.registry[{id:${module.namespace}}]`,
    "function imp:manage/enable"
  ];
}

export function makeForgetDispatchCommands(module: DatapackModule): string[] {
  return [
    "execute as d-e-a-d-beef run data modify entity @s Item.tag.__args__.imp.manage.entry " +
      `set from entity @s Item.tag.imp.registry[{id:${module.namespace}}]`,
    "function imp:manage/forget"
  ];
}

export function makeDisableDispatchCommands(module: DatapackModule): string[] {
  return [
    "execute as d-e-a-d-beef run data modify entity @s Item.tag.__args__.imp.manage.entry " +
      `set from entity @s Item.tag.imp.registry[{id:${module.namespace}}]`,
    "function imp:manage/disable"
  ];
}

export function makeUninstallDispatchCommands(
  module: DatapackModule
): string[] {
  return [
    "execute as d-e-a-d-beef run data modify entity @s Item.tag.__args__.imp.manage.entry " +
      `set from entity @s Item.tag.imp.registry[{id:${module.namespace}}]`,
    "function imp:manage/uninstall"
  ];
}

export function makeEnableDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeEnableDispatchCommands(module).join("','") + "']";
}

export function makeForgetDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeForgetDispatchCommands(module).join("','") + "']";
}

export function makeDisableDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeDisableDispatchCommands(module).join("','") + "']";
}

export function makeUninstallDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeUninstallDispatchCommands(module).join("','") + "']";
}

export function makeRegisterCommands(module: DatapackModule): string[] {
  // ENABLE BUTTON -------------------------------------------------------------

  const enableButtonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeEnableDispatchCommandsString(module) +
    "}}";

  console.log(`Length of enable button command: ${enableButtonCommand.length}`);
  console.log(`    ${enableButtonCommand}`);

  if (enableButtonCommand.length > 255) {
    console.error(
      new Error(
        "Enable button command exceeds chat command limit: " +
          enableButtonCommand
      )
    );
  }

  // FORGET BUTTON -------------------------------------------------------------

  const forgetButtonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeForgetDispatchCommandsString(module) +
    "}}";

  console.log(`Length of forget button command: ${forgetButtonCommand.length}`);
  console.log(`    ${forgetButtonCommand}`);

  if (forgetButtonCommand.length > 255) {
    console.error(
      new Error(
        "Forget button command exceeds chat command limit: " +
          forgetButtonCommand
      )
    );
  }

  // DISABLE BUTTON ------------------------------------------------------------

  const disableButtonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeDisableDispatchCommandsString(module) +
    "}}";

  console.log(
    `Length of disable button command: ${disableButtonCommand.length}`
  );
  console.log(`    ${disableButtonCommand}`);

  if (disableButtonCommand.length > 255) {
    console.error(
      new Error(
        "Disable button command exceeds chat command limit: " +
          disableButtonCommand
      )
    );
  }

  // UNINSTALL BUTTON ----------------------------------------------------------

  const uninstallButtonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeUninstallDispatchCommandsString(module) +
    "}}";

  console.log(
    `Length of uninstall button command: ${uninstallButtonCommand.length}`
  );
  console.log(`    ${uninstallButtonCommand}`);

  if (uninstallButtonCommand.length > 255) {
    console.error(
      new Error(
        "Uninstall button command exceeds chat command limit " +
          uninstallButtonCommand
      )
    );
  }

  // TEXT COMPONENTS -----------------------------------------------------------

  const registrantNbtTextComponents = {
    title: JSON.stringify(makeClickableTitleComponent(module)),
    authors: JSON.stringify(makeClickableAuthorsComponent(module)),
    color: JSON.stringify({
      text: "",
      color: module.color
    }),
    enable_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "green" },
          { text: "enable", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
      },
      clickEvent: {
        action: "run_command",
        value: enableButtonCommand
      }
    }),
    forget_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "red" },
          { text: "forget", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
      },
      clickEvent: {
        action: "run_command",
        value: forgetButtonCommand
      }
    }),
    disable_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "red" },
          { text: "disable", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
      },
      clickEvent: {
        action: "run_command",
        value: disableButtonCommand
      }
    }),
    uninstall_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "red" },
          { text: "uninstall", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
      },
      clickEvent: {
        action: "run_command",
        value: uninstallButtonCommand
      }
    })
  };

  // ---------------------------------------------------------------------------

  const registrantNbtDispatchCommands = {
    setup: `function ${module.namespace}:${module.setup_function}`,
    teardown: `function ${module.namespace}:${module.teardown_function}`,
    enable: `datapack enable "file/${module.namespace}"`,
    disable: `datapack disable "file/${module.namespace}"`,
    mark_uninstalled:
      `data modify entity d-e-a-d-beef ` +
      `Item.tag.imp.registry[{id: ${module.namespace}}].installed set value false`,
    forget:
      `data remove entity d-e-a-d-beef ` +
      `Item.tag.imp.registry[{id: ${module.namespace}}]`
  };

  // ---------------------------------------------------------------------------

  const registrantNbt = {
    title: module.title,
    color: module.color,
    description: module.description,
    version: module.version,
    minecraft_version: module.minecraft_version,
    category: module.category,
    namespace: module.namespace,
    scorespace: module.scorespace,
    url: module.url,
    authors: module.authors,
    dependencies: module.dependencies,
    manage_function: module.manage_function,
    setup_function: module.setup_function,
    teardown_function: module.teardown_function,
    // extras
    version_major: Number(module.version.split(".")[0]),
    version_minor: Number(module.version.split(".")[1]),
    version_patch: Number(module.version.split(".")[2].split("-")[0]),
    version_label: module.version.split("-")[1],
    components: registrantNbtTextComponents,
    commands: registrantNbtDispatchCommands
  };

  return [
    "execute if data entity @s Item.tag.__args__.imp.manage{register: true} run data modify entity @s Item.tag.__args__.imp.registrants append value " +
      JSON.stringify(registrantNbt)
  ];
}

export function makeInstallCommands(module: DatapackModule): string[] {
  const execute =
    `execute if data entity @s ` +
    `Item.tag.__args__.imp.manage{install: [${module.namespace}]} run`;

  const commands = [`function ${module.namespace}:${module.setup_function}`];

  return commands.map(command => {
    return `${execute} ${command}`;
  });
}

export function makeManagementFunction(module: DatapackModule) {
  return [
    ...makeRegisterCommands(module),
    ...makeInstallCommands(module),
    ""
  ].join("\n");
}

export function makeManagementTag(module: DatapackModule) {
  return JSON.stringify({
    values: [`${module.namespace}:${module.manage_function}`]
  });
}
