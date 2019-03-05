export interface ModuleDependency {
  namespace: string;
  version: string;
}

export interface ModuleAuthor {
  name: string;
  url: string;
}

export interface Module {
  title: string;
  color: string;
  description: string;
  version: string;
  version_tuple: number[];
  version_label: string;
  minecraft_version: string;
  category: string;
  namespace: string;
  scorespace: string;
  url: string;
  authors: ModuleAuthor[];
  dependencies: ModuleDependency[];
}
