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
      text: `${module.version} for Minecraft ${module.minecraftVersion}`,
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

export function makeManageDispatchCommands(
  module: DatapackModule,
  route: string
): string[] {
  return [
    "execute as d-e-a-d-beef run data modify entity @s Item.tag.__args__.imp.manage.entry " +
      `set from entity @s Item.tag.imp.registry[{id:${module.namespace}}]`,
    `function imp:manage/${route}`
  ];
}

export function makeManageDispatchCommandsString(
  module: DatapackModule,
  route: string
): string {
  return "['" + makeManageDispatchCommands(module, route).join("','") + "']";
}

export function makeManageButtonCommand(
  module: DatapackModule,
  route: string
): string {
  const buttonCommand =
    `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:` +
    makeManageDispatchCommandsString(module, route) +
    "}}";

  console.debug(
    `Length of command for ${route} button: ${buttonCommand.length}`
  );
  console.debug(`    ${buttonCommand}`);

  if (buttonCommand.length > 255) {
    console.warn(`Command for ${route} button exceeds chat command limit`);
  }

  return buttonCommand;
}

export function makeManageButtonComponent(
  module: DatapackModule,
  route: string,
  color: string
): any {
  return {
    text: "",
    hoverEvent: {
      action: "show_text",
      value: [
        { text: "Click to ", color: color },
        { text: route, bold: true },
        " ",
        { text: module.title, color: module.color }
      ]
    },
    clickEvent: {
      action: "run_command",
      value: makeManageButtonCommand(module, route)
    }
  };
}

export function makeRegisterCommands(module: DatapackModule): string[] {
  const registrantNbt = {
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
    dependencies: module.dependencies,
    manage_function: module.manageFunction,
    setup_function: module.setupFunction,
    teardown_function: module.teardownFunction,

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
        color: module.color
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
      )
    },

    // command strings
    commands: {
      setup: `function ${module.namespace}:${module.setupFunction}`,
      teardown: `function ${module.namespace}:${module.teardownFunction}`,
      enable: `datapack enable "file/${module.namespace}"`,
      disable: `datapack disable "file/${module.namespace}"`,
      mark_uninstalled:
        `data modify entity d-e-a-d-beef ` +
        `Item.tag.imp.registry[{id: ${
          module.namespace
        }}].installed set value false`,
      forget:
        `data remove entity d-e-a-d-beef ` +
        `Item.tag.imp.registry[{id: ${module.namespace}}]`
    }
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

  const commands = [`function ${module.namespace}:${module.setupFunction}`];

  return commands.map(command => {
    return `${execute} ${command}`;
  });
}

export function makePackMcMeta(module: DatapackModule) {
  return JSON.stringify({
    pack: {
      pack_format: 4,
      description: makeHoverCardComponent(module)
    }
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
    values: [`${module.namespace}:${module.manageFunction}`]
  });
}
