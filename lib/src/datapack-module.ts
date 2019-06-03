export interface DatapackModuleDependency {
  namespace: string;
  version: string;
}

export interface DatapackModuleAuthor {
  name: string;
  url: string;
}

export class DatapackModule {
  title: string;
  color: string;
  description: string;
  version: string;
  minecraft_version: string;
  category: string;
  namespace: string;
  scorespace: string;
  url: string;
  authors: DatapackModuleAuthor[];
  dependencies: DatapackModuleDependency[];
  manage_function: string = ".module/manage";
  setup_function: string = ".module/setup";
  teardown_function: string = ".module/teardown";

  constructor(args: any) {
    Object.assign(this, args);
  }
}
