export interface DatapackModuleDependency {
  namespace: string;
  version: string;
}

export interface DatapackModuleAuthor {
  name: string;
  url: string;
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

  public static fromObject(obj: any): DatapackModule {
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
}
