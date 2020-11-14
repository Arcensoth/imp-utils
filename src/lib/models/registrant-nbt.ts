import { VersionComponents, VersionRange } from "./version";

export interface RegistrantAuthor {
  name: string;
  url?: string;
  click?: string;
}

export interface RegistrantDependency {
  id: string;
  version_ranges: VersionRange[];
}

export interface RegistrantCommands {
  pause: string;
  resume: string;
  setup: string;
  teardown: string;
  enable: string[];
  disable: string[];
}

export interface RegistrantComponents {
  click_website: string;
  action_menu: string;
  action_enable: string;
  action_forget: string;
  action_disable: string;
  action_uninstall: string;
  action_reinstall: string;
}

export interface RegistrantNbt {
  module_format: number;
  pack_format: number;
  title: string;
  description: string;
  version: VersionComponents;
  namespace: string;
  scorespace: string;
  url?: string;
  authors: RegistrantAuthor[];
  dependencies: RegistrantDependency[];
  commands: RegistrantCommands;
  components: RegistrantComponents;
}
