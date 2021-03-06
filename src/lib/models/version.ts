export interface VersionComparator {
  operation: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface VersionRange {
  comparators: VersionComparator[];
}

export interface VersionComponents {
  full: string;
  major: number;
  minor: number;
  patch: number;
}
