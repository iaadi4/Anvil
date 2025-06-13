import fs from 'fs-extra';

/**
 * Merge JS/TS files:
 * - Adds imports from addon to the top (if not already present)
 * - Appends the rest of the addon code to the end
 */
export async function mergeCodeFiles(targetFile: string, addonFile: string) {
  const [targetExists, addonExists] = await Promise.all([
    fs.pathExists(targetFile),
    fs.pathExists(addonFile),
  ]);

  if (!addonExists) return;
  if (!targetExists) {
    await fs.copy(addonFile, targetFile);
    return;
  }

  const [targetCode, addonCode] = await Promise.all([
    fs.readFile(targetFile, 'utf8'),
    fs.readFile(addonFile, 'utf8'),
  ]);

  const extractImports = (code: string) => {
    return code
      .split('\n')
      .filter(line => /^import\s.+from\s.+;$/.test(line.trim()));
  };

  const targetImports = extractImports(targetCode);
  const addonImports = extractImports(addonCode);

  const allImports = new Set<string>(targetImports);

  const newImports = addonImports.filter(imp => !allImports.has(imp));

  const targetBody = targetCode
    .split('\n')
    .filter(line => !/^import\s.+from\s.+;$/.test(line.trim()))
    .join('\n');

  const addonBody = addonCode
    .split('\n')
    .filter(line => !/^import\s.+from\s.+;$/.test(line.trim()))
    .join('\n');

  const merged = [...targetImports, ...newImports, '', targetBody.trim(), '', addonBody.trim()].join('\n');

  await fs.writeFile(targetFile, merged, 'utf8');
}
