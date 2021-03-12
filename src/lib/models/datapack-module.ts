import * as constants from "../constants";
import {
  formatJson,
  makeVersionComponents,
  makeVersionRanges,
  removeUndefined,
  stringifyClickComponent,
  stringiyfyNbt,
} from "../utils";
import {
  DatapackModuleAccessor,
  DatapackModuleAuthor,
  DatapackModuleDefinition,
  DatapackModuleDependencyMap,
  TextComponent,
} from "./datapack-module-definition";
import {
  RegistrantAccessor,
  RegistrantAuthor,
  RegistrantBaseCommands,
  RegistrantBaseComponents,
  RegistrantDependency,
  RegistrantNbt,
} from "./registrant-nbt";
import { VersionParts } from "./version";

export class DatapackModule {
  public name: string;
  public version: string;

  public title?: TextComponent;
  public description?: TextComponent;

  public homepage?: string;
  public bugs?: string;

  public keywords: string[];

  public authors: DatapackModuleAuthor[];

  public dependencies: DatapackModuleDependencyMap;

  public accessors: DatapackModuleAccessor[];

  public filenames: string[];

  public registerFunction: string;
  public aboutFunction: string;
  public pauseFunction: string;
  public resumeFunction: string;
  public reinstallFunction: string;
  public uninstallFunction: string;

  public moduleFormat: number;
  public packFormat: number;
  public gameVersion: string;

  constructor(args: {
    name: string;
    version: string;

    title?: TextComponent;
    description?: TextComponent;

    homepage?: string;
    bugs?: string;

    keywords?: string[];

    authors?: DatapackModuleAuthor[];

    dependencies?: DatapackModuleDependencyMap;

    accessors?: DatapackModuleAccessor[];

    filenames?: string[];

    registerFunction?: string;
    aboutFunction?: string;
    pauseFunction?: string;
    resumeFunction?: string;
    reinstallFunction?: string;
    uninstallFunction?: string;

    moduleFormat?: number;
    packFormat?: number;
    gameVersion?: string;
  }) {
    this.name = args.name;
    this.version = args.version;

    this.title = args.title;
    this.description = args.description;

    this.homepage = args.homepage;
    this.bugs = args.bugs;

    this.keywords = args.keywords || [];

    this.authors = args.authors || [];

    this.dependencies = args.dependencies || {};

    this.accessors = args.accessors || [];

    this.filenames = args.filenames || [
      this.name,
      `${this.name}.zip`,
      `${this.name}-${this.version}.zip`,
    ];

    this.registerFunction = args.registerFunction || ".module/register";
    this.aboutFunction = args.aboutFunction || ".module/about";
    this.pauseFunction = args.pauseFunction || ".module/pause";
    this.resumeFunction = args.resumeFunction || ".module/resume";
    this.reinstallFunction = args.reinstallFunction || ".module/reinstall";
    this.uninstallFunction = args.uninstallFunction || ".module/uninstall";

    this.moduleFormat = args.moduleFormat || constants.DEFAULT_MODULE_FORMAT;
    this.packFormat = args.packFormat || constants.DEFAULT_PACK_FORMAT;
    this.gameVersion = args.gameVersion || constants.DEFAULT_GAME_VERSION;
  }

  public static fromObject(obj: DatapackModuleDefinition): DatapackModule {
    return new DatapackModule(obj);
  }

  public get titleOrName(): string {
    return this.title ? this.title : this.name;
  }

  public get registrantAuthors(): RegistrantAuthor[] {
    return this.authors.map((author) => {
      const data: RegistrantAuthor = {
        name: author.name,
        url: author.url,
        click_component: author.url
          ? stringifyClickComponent("open_url", author.url)
          : undefined,
      };
      if (!data.url) {
        delete data.url;
        delete data.click_component;
      }
      return data;
    });
  }

  public get registrantDependencies(): RegistrantDependency[] {
    return Object.keys(this.dependencies).map((key) => {
      const value = this.dependencies[key];
      const versionRanges = makeVersionRanges(value);
      return {
        name: key,
        version_ranges: versionRanges,
      };
    });
  }

  public get registrantAccessors(): RegistrantAccessor[] {
    return this.accessors.map((accessor) => {
      return accessor;
    });
  }

  public get aboutFunctionCommand(): string {
    return `function ${this.name}:${this.aboutFunction}`;
  }

  public get pauseFunctionCommand(): string {
    return `function ${this.name}:${this.pauseFunction}`;
  }

  public get resumeFunctionCommand(): string {
    return `function ${this.name}:${this.resumeFunction}`;
  }

  public get reinstallFunctionCommand(): string {
    return `function ${this.name}:${this.reinstallFunction}`;
  }

  public get uninstallFunctionCommand(): string {
    return `function ${this.name}:${this.uninstallFunction}`;
  }

  public get enableDatapackCommands(): string[] {
    return this.filenames.map(
      (filename) => `datapack enable "file/${filename}"`
    );
  }

  public get disableDatapackCommands(): string[] {
    return this.filenames.map(
      (filename) => `datapack disable "file/${filename}"`
    );
  }

  public get registrantBaseCommands(): RegistrantBaseCommands {
    return {
      pause_function: this.pauseFunctionCommand,
      resume_function: this.resumeFunctionCommand,
      reinstall_function: this.reinstallFunctionCommand,
      uninstall_function: this.uninstallFunctionCommand,
      enable_datapacks: this.enableDatapackCommands,
      disable_datapacks: this.disableDatapackCommands,
    };
  }

  public get registrantBaseComponents(): RegistrantBaseComponents {
    const baseComponents: RegistrantBaseComponents = {
      click_manage: this.stringifiedActionComponent("manage"),
      click_enable: this.stringifiedActionComponent("enable"),
      click_disable: this.stringifiedActionComponent("disable"),
      click_reinstall: this.stringifiedActionComponent("reinstall"),
      click_uninstall: this.stringifiedActionComponent("uninstall"),
      click_forget: this.stringifiedActionComponent("forget"),
      click_homepage: this.homepage
        ? stringifyClickComponent("open_url", this.homepage)
        : undefined,
      click_bugs: this.bugs
        ? stringifyClickComponent("open_url", this.bugs)
        : undefined,
      click_about: stringifyClickComponent(
        "run_command",
        `/${this.aboutFunctionCommand}`
      ),
    };
    return removeUndefined(baseComponents);
  }

  private actionCommand(action: string): string {
    const technicalSnbt = `{__imp__: {manage: true, action: ${action}, name: ${this.name}}}`;
    const buttonCommand = `/give @s ${constants.TECHNICAL_ITEM}${technicalSnbt}`;

    if (buttonCommand.length > constants.CHAT_LIMIT) {
      console.error(
        `Command for ${action} button exceeds chat limit ` +
          `(${buttonCommand.length} > ${constants.CHAT_LIMIT}): ${buttonCommand}`
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

  public get versionComponents(): VersionParts {
    return makeVersionComponents(this.version);
  }

  public get registrantNbt(): RegistrantNbt {
    const registrantNbt: RegistrantNbt = {
      name: this.name,
      version: this.versionComponents,

      title: this.title ? JSON.stringify(this.title) : undefined,
      description: this.description
        ? JSON.stringify(this.description)
        : undefined,

      homepage: this.homepage,
      bugs: this.bugs,

      keywords: this.keywords,

      authors: this.registrantAuthors,

      dependencies: this.registrantDependencies,

      accessors: this.registrantAccessors,

      base_commands: this.registrantBaseCommands,
      base_components: this.registrantBaseComponents,

      module_format: this.moduleFormat,
      pack_format: this.packFormat,
      game_version: this.gameVersion,
    };
    return removeUndefined(registrantNbt);
  }

  public get registerCommand(): string {
    return (
      "data modify storage imp:io registrants append value " +
      stringiyfyNbt(this.registrantNbt)
    );
  }

  public get packMcMetaContents(): string {
    // base components to fit on pack selection menu
    const descriptionComponents = [
      { text: "", color: "dark_gray" },
      this.titleOrName,
      "\n",
      { text: this.version, color: "gray" },
      " for ",
      { text: this.gameVersion, color: "gray" },
    ];

    // add module authors, if any
    if (this.authors.length > 0) {
      descriptionComponents.push("\n");
      descriptionComponents.push("By ");
      this.authors.forEach((author) => {
        descriptionComponents.push({ text: author.name, color: "yellow" });
        descriptionComponents.push(", ");
      });
      descriptionComponents.pop();
    }

    // add module description, if any
    if (this.description) {
      descriptionComponents.push("\n");
      descriptionComponents.push({ text: this.description, color: "gray" });
    }

    const content = {
      pack: {
        pack_format: this.packFormat,
        description: descriptionComponents,
      },
    };

    return formatJson(content);
  }

  public get registerFunctionContents(): string {
    return [this.registerCommand].join("\n");
  }

  public get registerTagContents(): string {
    const content = {
      values: [`${this.name}:${this.registerFunction}`],
    };
    return formatJson(content);
  }
}
