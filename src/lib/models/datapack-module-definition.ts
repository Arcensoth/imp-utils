import { DatapackModuleAuthor } from "./datapack-module-author";
import { DatapackModuleDependencyMap } from "./datapack-module-dependency-map";

export interface DatapackModuleDefinition {
  module_format: number;
  pack_format: number;
  title: string;
  styled_title: string;
  description: string;
  version: string;
  namespace: string;
  scorespace: string;
  url?: string;
  authors?: DatapackModuleAuthor[];
  dependencies?: DatapackModuleDependencyMap;
  manage_function?: string;
  pause_function?: string;
  resume_function?: string;
  setup_function?: string;
  teardown_function?: string;
  menu_function?: string;
}
