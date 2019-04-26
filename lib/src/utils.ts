import { DatapackModule } from "./datapack-module";

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

export function makeForgetDispatchCommands(module: DatapackModule): string[] {
  return [
    "data modify entity d-e-a-d-beef Item.tag.__args__.imp.manage.forget " +
      `set value ${module.namespace}`,
    "function imp:manage/forget"
    // TODO in datapack: iterate over registry, find and delete match, print menu
    // "execute as d-e-a-d-beef at @s run " +
    //   `data remove entity d-e-a-d-beef ` +
    //   `Item.tag.imp.registry[{id: ${module.namespace}}]`
    // "execute as d-e-a-d-beef at @s run function imp:core/print_menu"
  ];
}

export function makeForgetDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeForgetDispatchCommands(module).join("', '") + "']";
}

export function makeUninstallDispatchCommands(
  module: DatapackModule
): string[] {
  // TODO in datapack: set manage flags, call manage hook
  return [
    "data modify entity d-e-a-d-beef Item.tag.__args__.imp.manage.uninstall " +
      `set value ${module.namespace}`,
    "function imp:manage/uninstall"
  ];
}

export function makeUninstallDispatchCommandsString(
  module: DatapackModule
): string {
  return "['" + makeUninstallDispatchCommands(module).join("', '") + "']";
}

export function makeRegisterCommands(module: DatapackModule): string[] {
  const forgetButtonCommand =
    "/give @s minecraft:command_block" +
    "{imp:{trigger: {type: dispatch_commands, commands: " +
    makeForgetDispatchCommandsString(module) +
    "}}}";

  console.log(`Length of forget button command: ${forgetButtonCommand.length}`);

  if (forgetButtonCommand.length > 255) {
    console.error(
      new Error(
        "Forget button command exceeds chat command limit: " +
          forgetButtonCommand
      )
    );
  }

  const uninstallButtonCommand =
    "/give @s minecraft:command_block" +
    "{imp:{trigger: {type: dispatch_commands, commands: " +
    makeUninstallDispatchCommandsString(module) +
    "}}}";

  console.log(
    `Length of uninstall button command: ${uninstallButtonCommand.length}`
  );

  if (uninstallButtonCommand.length > 255) {
    console.error(
      new Error(
        "Uninstall button command exceeds chat command limit " +
          uninstallButtonCommand
      )
    );
  }

  const registrantNbtComponents = {
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
        value: `/datapack enable "file/${module.namespace}"`
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
        value: `/datapack disable "file/${module.namespace}"`
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
    // extras
    version_major: Number(module.version.split(".")[0]),
    version_minor: Number(module.version.split(".")[1]),
    version_patch: Number(module.version.split(".")[2].split("-")[0]),
    version_label: module.version.split("-")[1],
    components: registrantNbtComponents
  };

  return [
    "execute if data entity @s Item.tag.__args__.imp.manage{register: true} run data modify entity @s Item.tag.__args__.imp.registrants append value " +
      JSON.stringify(registrantNbt)
  ];
}

export function makeInstallCommands(module: DatapackModule): string[] {
  return [
    `execute if data entity @s` +
      ` Item.tag.__args__.imp.manage{install: ['${module.namespace}']}` +
      ` run function ${module.namespace}:.module/setup`
  ];
}

export function makeUninstallCommands(module: DatapackModule): string[] {
  const execute =
    `execute if data entity @s ` +
    `Item.tag.__args__.imp.manage{uninstall: ['${module.namespace}']} run`;

  return [
    `${execute} function ${module.namespace}:.module/teardown`,
    `${execute} datapack disable "file/${module.namespace}"`
  ];
}

export function makeManageMcfunction(module: DatapackModule) {
  return [
    ...makeRegisterCommands(module),
    ...makeInstallCommands(module),
    ...makeUninstallCommands(module),
    ""
  ].join("\n");
}

export function makeManageTagJson(module: DatapackModule) {
  return JSON.stringify({
    values: [`${module.namespace}:.module/manage`]
  });
}
