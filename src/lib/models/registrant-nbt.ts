import { VersionParts, VersionRange } from "./version";

export type RawTextComponent = string;

export interface RegistrantAuthor {
  name: string;
  url?: string;
  click_component?: string;
}

export interface RegistrantDependency {
  name: string;
  version_ranges: VersionRange[];
}

export interface RegistrantAccessor {
  type: string;
}

export interface RegistrantBaseCommands {
  pause_function: string;
  resume_function: string;
  reinstall_function: string;
  uninstall_function: string;
  enable_datapacks: string[];
  disable_datapacks: string[];
}

export interface RegistrantBaseComponents {
  click_manage: string;
  click_enable: string;
  click_disable: string;
  click_reinstall: string;
  click_uninstall: string;
  click_forget: string;
  click_homepage: string;
  click_bugs?: string;
  click_about?: string;
}

export interface RegistrantNbt {
  name: string;
  version: VersionParts;

  title?: RawTextComponent;
  description?: RawTextComponent;

  homepage?: string;
  bugs?: string;

  keywords: string[];

  authors: RegistrantAuthor[];

  dependencies: RegistrantDependency[];

  accessors: RegistrantAccessor[];

  base_commands: RegistrantBaseCommands;
  base_components: RegistrantBaseComponents;

  module_format: number;
  pack_format: number;
  game_version: string;
}
