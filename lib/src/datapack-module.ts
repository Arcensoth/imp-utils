export interface DatapackModuleDependency {
  namespace: string;
  version: string;
}

export interface DatapackModuleAuthor {
  name: string;
  url: string;
}

export interface DatapackModule {
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
}
