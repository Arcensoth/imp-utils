export type TextComponent = any;

export interface DatapackModuleAuthor {
  name: string;
  url?: string;
}

export interface DatapackModuleDependencyMap {
  [name: string]: string;
}

export interface DatapackModuleAccessor {
  type: string;
}

export interface DatapackModuleDefinition {
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

  register_function?: string;
  about_function?: string;
  pause_function?: string;
  resume_function?: string;
  reinstall_function?: string;
  uninstall_function?: string;

  module_format?: number;
  pack_format?: number;
  game_version?: string;
}
