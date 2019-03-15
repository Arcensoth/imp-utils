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

export function makeRegisterCommands(module: DatapackModule): string[] {
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
      }
    }),
    forget_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "gray" },
          { text: "forget", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
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
      }
    }),
    uninstall_button: JSON.stringify({
      text: "",
      hoverEvent: {
        action: "show_text",
        value: [
          { text: "Click to ", color: "gray" },
          { text: "uninstall", bold: true },
          " ",
          { text: module.title, color: module.color }
        ]
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
    version_data: {
      major: Number(module.version.split(".")[0]),
      minor: Number(module.version.split(".")[1]),
      patch: Number(module.version.split(".")[2].split("-")[0]),
      label: module.version.split("-")[1]
    },
    components: registrantNbtComponents
  };

  return [
    "execute if data entity @s Item.tag._imp.manage{register: true} run data modify entity @s Item.tag._imp.temp.registrants append value " +
      JSON.stringify(registrantNbt)
  ];
}

export function makeInstallCommands(module: DatapackModule): string[] {
  return [
    `execute if data entity @s` +
      ` Item.tag._imp.manage{install: ['${module.namespace}']}` +
      ` run function ${module.namespace}:.module/setup`
  ];
}

export function makeManageMcfunction(module: DatapackModule) {
  return [
    ...makeRegisterCommands(module),
    ...makeInstallCommands(module),
    ""
  ].join("\n");
}

export function makeManageTagJson(module: DatapackModule) {
  return JSON.stringify({
    values: [`${module.namespace}:.module/manage`]
  });
}
