import fs from 'fs-extra';

/**
 * Deep merges JSON files.
 * - Merges scripts, dependencies, etc.
 * - Overwrites duplicate keys from addon
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

  const merged = deepMerge(targetJson, addonJson);
  await fs.writeJson(targetFile, merged, { spaces: 2 });
}

function deepMerge(target: any, source: any): any {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
