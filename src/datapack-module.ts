export interface DatapackModuleDependencyMap {
  [id: string]: string;
}

export interface DatapackModuleAuthor {
  name: string;
  url?: string;
}

export interface DatapackModuleProperties {
  module_format: string;
  title: string;
  color: string;
  description: string;
  version: string;
  minecraft_version: string;
  category: string;
  namespace: string;
  scorespace: string;
  authors: DatapackModuleAuthor[];
  dependencies?: DatapackModuleDependencyMap;
  url?: string;
  manage_function?: string;
  setup_function?: string;
  teardown_function?: string;
  menu_function?: string;
}

export class DatapackModule {
  constructor(
    public moduleFormat: string,
    public title: string,
    public color: string,
    public description: string,
    public version: string,
    public minecraftVersion: string,
    public category: string,
    public namespace: string,
    public scorespace: string,
    public authors: DatapackModuleAuthor[],
    public dependencies: DatapackModuleDependencyMap = {},
    public url?: string,
    public manageFunction: string = ".module/manage",
    public pauseFunction: string = ".module/pause",
    public resumeFunction: string = ".module/resume",
    public setupFunction: string = ".module/setup",
    public teardownFunction: string = ".module/teardown",
    public menuFunction: string = ".module/menu"
  ) {}

  public static fromObject(obj: DatapackModuleProperties): DatapackModule {
    const dp = new DatapackModule(
      obj.module_format,
      obj.title,
      obj.color,
      obj.description,
      obj.version,
      obj.minecraft_version,
      obj.category,
      obj.namespace,
      obj.scorespace,
      obj.authors,
      obj.dependencies,
      obj.url,
      obj.manage_function,
      obj.setup_function,
      obj.teardown_function,
      obj.menu_function
    );
    return dp;
  }

  public toObject(): DatapackModuleProperties {
    return {
      module_format: this.moduleFormat,
      title: this.title,
      color: this.color,
      description: this.description,
      version: this.version,
      minecraft_version: this.minecraftVersion,
      category: this.category,
      namespace: this.namespace,
      scorespace: this.scorespace,
      authors: this.authors,
      dependencies: this.dependencies,
      url: this.url,
      manage_function: this.manageFunction,
      setup_function: this.setupFunction,
      teardown_function: this.teardownFunction,
      menu_function: this.menuFunction,
    };
  }
}
