import fs from 'fs-extra';
import path from 'path';

/**
 * Deep merges JSON files.
 * Special cases:
 * - tsconfig.json / tsconfig.app.json: custom merge for paths & references.
 * - Other files: regular deep merge.
 */
export async function mergeJsonFiles(targetFile: string, addonFile: string) {
  const [targetExists, addonExists] = await Promise.all([
    fs.pathExists(targetFile),
    fs.pathExists(addonFile),
  ]);

  if (!addonExists) return;
  if (!targetExists) {
    await fs.copy(addonFile, targetFile);
    return;
  }

  const [targetJson, addonJson] = await Promise.all([
    fs.readJson(targetFile),
    fs.readJson(addonFile),
  ]);

  const fileName = path.basename(targetFile);
  let merged;

  if (fileName.startsWith('tsconfig')) {
    merged = mergeTsConfig(targetJson, addonJson);
  } else {
    merged = deepMerge(targetJson, addonJson);
  }

  await fs.writeJson(targetFile, merged, { spaces: 2 });
}

function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      key in result &&
      !(source[key] instanceof Array)
    ) {
      result[key] = deepMerge(result[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

function mergeTsConfig(base: any, addon: any): any {
  const merged = { ...base };

  // Merge compilerOptions
  merged.compilerOptions = {
    ...(base.compilerOptions || {}),
    ...(addon.compilerOptions || {}),
    paths: {
      ...(base.compilerOptions?.paths || {}),
      ...(addon.compilerOptions?.paths || {}),
    },
  };

  // Merge paths array values
  const basePaths = base.compilerOptions?.paths || {};
  const addonPaths = addon.compilerOptions?.paths || {};
  for (const key in addonPaths) {
    const baseArr = basePaths[key] || [];
    const addonArr = addonPaths[key];
    merged.compilerOptions.paths[key] = Array.from(new Set([...baseArr, ...addonArr]));
  }

  // Merge references
  const baseRefs = base.references || [];
  const addonRefs = addon.references || [];
  const existingPaths = new Set(baseRefs.map((ref: any) => ref.path));
  merged.references = [
    ...baseRefs,
    ...addonRefs.filter((ref: any) => !existingPaths.has(ref.path)),
  ];

  return merged;
}
