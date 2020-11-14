import { CHAT_LIMIT, TECHNICAL_ITEM } from "../constants";
import {
  makeVersionComponents,
  makeVersionRanges,
  stringifyClickComponent,
  stringiyfyNbt,
} from "../utils";
import { DatapackModuleAuthor } from "./datapack-module-author";
import { DatapackModuleDefinition } from "./datapack-module-definition";
import { DatapackModuleDependencyMap } from "./datapack-module-dependency-map";
import {
  RegistrantAuthor,
  RegistrantCommands,
  RegistrantComponents,
  RegistrantDependency,
  RegistrantNbt,
} from "./registrant-nbt";
import { VersionComponents } from "./version";

export class DatapackModule {
  public moduleFormat: number;
  public packFormat: number;
  public title: string;
  public styled_title: any;
  public description: string;
  public version: string;
  public namespace: string;
  public scorespace: string;
  public authors: DatapackModuleAuthor[];
  public dependencies: DatapackModuleDependencyMap;
  public url?: string;
  public manageFunction: string;
  public pauseFunction: string;
  public resumeFunction: string;
  public setupFunction: string;
  public teardownFunction: string;
  public menuFunction: string;

  constructor(args: {
    moduleFormat: number;
    packFormat: number;
    title: string;
    styled_title: any;
    description: string;
    version: string;
    namespace: string;
    scorespace: string;
    authors?: DatapackModuleAuthor[];
    dependencies?: DatapackModuleDependencyMap;
    url?: string;
    manageFunction?: string;
    pauseFunction?: string;
    resumeFunction?: string;
    setupFunction?: string;
    teardownFunction?: string;
    menuFunction?: string;
  }) {
    this.moduleFormat = args.moduleFormat;
    this.packFormat = args.packFormat;
    this.title = args.title;
    this.styled_title = args.styled_title;
    this.description = args.description;
    this.version = args.version;
    this.namespace = args.namespace;
    this.scorespace = args.scorespace;
    this.authors = args.authors || [];
    this.dependencies = args.dependencies || {};
    this.url = args.url;
    this.manageFunction = args.manageFunction || ".module/manage";
    this.pauseFunction = args.pauseFunction || ".module/pause";
    this.resumeFunction = args.resumeFunction || ".module/resume";
    this.setupFunction = args.setupFunction || ".module/setup";
    this.teardownFunction = args.teardownFunction || ".module/teardown";
    this.menuFunction = args.menuFunction || ".module/menu";
  }

  public static fromObject(obj: DatapackModuleDefinition): DatapackModule {
    const dp = new DatapackModule({
      moduleFormat: obj.module_format,
      packFormat: obj.pack_format,
      title: obj.title,
      styled_title: obj.styled_title,
      description: obj.description,
      version: obj.version,
      namespace: obj.namespace,
      scorespace: obj.scorespace,
      authors: obj.authors,
      dependencies: obj.dependencies,
      url: obj.url,
      manageFunction: obj.manage_function,
      pauseFunction: obj.pause_function,
      resumeFunction: obj.resume_function,
      setupFunction: obj.setup_function,
      teardownFunction: obj.teardown_function,
      menuFunction: obj.menu_function,
    });
    return dp;
  }

  public toObject(): DatapackModuleDefinition {
    return {
      module_format: this.moduleFormat,
      pack_format: this.packFormat,
      title: this.title,
      styled_title: this.styled_title,
      description: this.description,
      version: this.version,
      namespace: this.namespace,
      scorespace: this.scorespace,
      url: this.url,
      authors: this.authors,
      dependencies: this.dependencies,
      manage_function: this.manageFunction,
      setup_function: this.setupFunction,
      teardown_function: this.teardownFunction,
      menu_function: this.menuFunction,
    };
  }

  public get registrantAuthors(): RegistrantAuthor[] {
    return this.authors.map((author) => {
      const data: RegistrantAuthor = {
        name: author.name,
        url: author.url,
        click: author.url ? stringifyClickComponent("open_url", author.url) : undefined,
      };
      if (!data.url) {
        delete data.url;
        delete data.click;
      }
      return data;
    });
  }

  public get registrantDependencies(): RegistrantDependency[] {
    return Object.keys(this.dependencies).map((key) => {
      const value = this.dependencies[key];
      const versionRanges = makeVersionRanges(value);
      return {
        id: key,
        version_ranges: versionRanges,
      };
    });
  }

  public get pauseCommand(): string {
    return `function ${this.namespace}:${this.pauseFunction}`;
  }

  public get resumeCommand(): string {
    return `function ${this.namespace}:${this.resumeFunction}`;
  }

  public get setupCommand(): string {
    return `function ${this.namespace}:${this.setupFunction}`;
  }

  public get teardownCommand(): string {
    return `function ${this.namespace}:${this.teardownFunction}`;
  }

  public get enableCommands(): string[] {
    return [
      `datapack enable "file/${this.namespace}"`,
      `datapack enable "file/${this.namespace}.zip"`,
      `datapack enable "file/${this.namespace}-${this.version}.zip"`,
    ];
  }

  public get disableCommands(): string[] {
    return [
      `datapack disable "file/${this.namespace}"`,
      `datapack disable "file/${this.namespace}.zip"`,
      `datapack disable "file/${this.namespace}-${this.version}.zip"`,
    ];
  }

  public get registrantCommands(): RegistrantCommands {
    return {
      pause: this.pauseCommand,
      resume: this.resumeCommand,
      setup: this.setupCommand,
      teardown: this.teardownCommand,
      enable: this.enableCommands,
      disable: this.disableCommands,
    };
  }

  public get registrantComponents(): RegistrantComponents {
    return {
      click_website: stringifyClickComponent("open_url", this.url),
      action_menu: this.stringifiedActionComponent("menu"),
      action_enable: this.stringifiedActionComponent("enable"),
      action_forget: this.stringifiedActionComponent("forget"),
      action_disable: this.stringifiedActionComponent("disable"),
      action_uninstall: this.stringifiedActionComponent("uninstall"),
      action_reinstall: this.stringifiedActionComponent("reinstall"),
    };
  }

  private actionCommand(action: string): string {
    // const dispatchCommands = [
    //   "data modify storage imp.__temp__:api/v0/manage __input__ " +
    //     `set value {id:${this.namespace},action:${action}}`,
    //   "function imp:api/v0/manage",
    // ];

    // const stringifiedDispatchCommands = JSON.stringify(dispatchCommands);

    // const buttonCommand = `/give @s ${TECHNICAL_ITEM}{imp:{d:1b,c:${stringifiedDispatchCommands}}}`;

    const technicalSnbt = `{__imp__: {manage: true, action: ${action}, id: ${this.namespace}}}`;
    const buttonCommand = `/give @s ${TECHNICAL_ITEM}${technicalSnbt}`;

    if (buttonCommand.length > CHAT_LIMIT) {
      console.error(
        `Command for ${action} button exceeds chat limit ` +
          `(${buttonCommand.length} > ${CHAT_LIMIT}): ${buttonCommand}`
      );
    }

    return buttonCommand;
  }

  private stringifiedActionComponent(action: string): string {
    const command = this.actionCommand(action);
    const unescapedComponent = stringifyClickComponent("run_command", command);
    const escapedComponent = unescapedComponent.replace(/\\"/g, '\\\\"');
    return escapedComponent;
  }

  public get versionComponents(): VersionComponents {
    return makeVersionComponents(this.version);
  }

  public get registrantNbt(): RegistrantNbt {
    const data: RegistrantNbt = {
      module_format: this.moduleFormat,
      pack_format: this.packFormat,
      title: this.title,
      description: this.description,
      version: this.versionComponents,
      namespace: this.namespace,
      scorespace: this.scorespace,
      url: this.url,
      authors: this.registrantAuthors,
      dependencies: this.registrantDependencies,
      commands: this.registrantCommands,
      components: this.registrantComponents,
    };
    if (!data.url) {
      delete data.url;
    }
    return data;
  }

  public get registerCommands(): string[] {
    const execute =
      `execute if data storage imp.__temp__:api/manage ` + `__temp__{register: true} run`;

    const commands = [
      "data modify storage imp.__temp__:api/manage __temp__.registrants append value " +
        stringiyfyNbt(this.registrantNbt),
    ];

    return commands.map((command) => {
      return `${execute} ${command}`;
    });
  }

  public get installCommands(): string[] {
    const execute =
      `execute if data storage imp.__temp__:api/manage ` +
      `__temp__{install: [${this.namespace}]} run`;

    const commands = [`function ${this.namespace}:${this.setupFunction}`];

    return commands.map((command) => {
      return `${execute} ${command}`;
    });
  }

  public get packMcMetaContents(): string {
    const descriptionComponents = [
      { text: "", color: "gray" },
      this.styled_title,
      "\\n",
      this.description,
      "\\n",
      {
        text: `Version ${this.version}`,
        color: "dark_gray",
      },
      "\\n",
      "By ",
    ];

    this.authors.forEach((author) => {
      descriptionComponents.push({ text: author.name, color: "yellow" });
      descriptionComponents.push(", ");
    });

    descriptionComponents.pop();

    const data = {
      pack: {
        pack_format: this.packFormat,
        description: descriptionComponents,
      },
    };

    return JSON.stringify(data);
  }

  public get managementFunctionContents(): string {
    return [...this.registerCommands, ...this.installCommands, ""].join("\n");
  }

  public get managementTagContents(): string {
    return JSON.stringify({
      values: [`${this.namespace}:${this.manageFunction}`],
    });
  }
}
