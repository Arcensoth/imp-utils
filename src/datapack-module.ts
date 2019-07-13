export interface DatapackModuleDependency {
  namespace: string;
  version: string;
}

export interface DatapackModuleAuthor {
  name: string;
  url?: string;
}

export interface DatapackModuleProperties {
  title: string;
  color: string;
  description: string;
  version: string;
  minecraft_version: string;
  category: string;
  namespace: string;
  scorespace: string;
  authors: DatapackModuleAuthor[];
  dependencies?: DatapackModuleDependency[];
  url?: string;
  manage_function?: string;
  setup_function?: string;
  teardown_function?: string;
}

export class DatapackModule {
  constructor(
    public title: string,
    public color: string,
    public description: string,
    public version: string,
    public minecraftVersion: string,
    public category: string,
    public namespace: string,
    public scorespace: string,
    public authors: DatapackModuleAuthor[],
    public dependencies: DatapackModuleDependency[] = [],
    public url?: string,
    public manageFunction: string = ".module/manage",
    public setupFunction: string = ".module/setup",
    public teardownFunction: string = ".module/teardown"
  ) {}

  public static fromObject(obj: DatapackModuleProperties): DatapackModule {
    const dp = new DatapackModule(
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
      obj.teardown_function
    );
    return dp;
  }

  public toObject(): DatapackModuleProperties {
    return {
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
      teardown_function: this.teardownFunction
    };
  }
}
