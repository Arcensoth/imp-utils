import { Range, SemVer } from "semver";
import { SUPPORTED_COMPARATORS } from "./constants";
import { VersionComparator, VersionComponents, VersionRange } from "./models/version";

export function stringifyClickComponent(action: string, value?: string): any {
  if (!value) {
    return "[]";
  }
  return JSON.stringify({
    text: "",
    clickEvent: {
      action: action,
      value: value,
    },
  });
}

export function makeVersionComponents(versionString: string): VersionComponents {
  const v = new SemVer(versionString);
  return {
    full: v.version,
    major: v.major,
    minor: v.minor,
    patch: v.patch,
  };
}

export function makeVersionRanges(versionString: string): VersionRange[] {
  const ranges: VersionRange[] = [];

  const r = new Range(versionString);

  console.log("");

  const ccc = r.set;

  for (const cc of ccc) {
    console.log(`  [${cc}]`);

    const comparators: VersionComparator[] = [];

    for (const c of cc) {
      const v = c.semver;
      const op = c.operator || (v instanceof SemVer ? "=" : "");

      console.log(`    [${c}] (${op})`);

      if (SUPPORTED_COMPARATORS.includes(op)) {
        comparators.push({
          operation: op,
          version: {
            major: v.major,
            minor: v.minor,
            patch: v.patch,
          },
        });
      } else if (op) {
        console.error(`Unsupported version comparator "${op}" in version: ${versionString}`);
      } else {
        console.warn(`Skipping empty version comparator in version: ${versionString}`);
      }
    }

    if (comparators.length > 0) {
      ranges.push({ comparators: comparators });
    }
  }

  console.log("");

  return ranges;
}

export function stringiyfyNbt(nbt: any): string {
  if (typeof nbt === "boolean") {
    return nbt ? "true" : "false";
  } else if (typeof nbt === "string") {
    return `'${nbt}'`;
  } else if (typeof nbt === "number") {
    return nbt.toString();
  } else if (Array.isArray(nbt)) {
    const items = nbt.map((item) => stringiyfyNbt(item));
    return "[" + items.join(", ") + "]";
  } else if (typeof nbt === "object") {
    const pairs = Object.keys(nbt).map((key) => {
      const value = stringiyfyNbt(nbt[key]);
      return `${key}: ${value}`;
    });
    return "{" + pairs.join(", ") + "}";
  }
  throw Error(`Cannot stringify NBT: ${nbt}`);
}
