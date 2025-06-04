import postcss from 'postcss';
import safeParse from 'postcss-safe-parser';
import fs from 'fs-extra';

/**
 * Merge two CSS files:
 * - Import statements go at the top
 * - All other rules go to the bottom
 */
export async function mergeCssFiles(targetFile: string, addonFile: string) {
  const [targetExists, addonExists] = await Promise.all([
    fs.pathExists(targetFile),
    fs.pathExists(addonFile),
  ]);

  if (!addonExists) return;
  if (!targetExists) {
    await fs.copy(addonFile, targetFile);
    return;
  }

  const [targetCss, addonCss] = await Promise.all([
    fs.readFile(targetFile, 'utf8'),
    fs.readFile(addonFile, 'utf8'),
  ]);

  const targetRoot = safeParse(targetCss);
  const addonRoot = safeParse(addonCss);

  const importSet = new Set<string>();

  // Collect existing imports from target
  targetRoot.walkAtRules('import', rule => {
    importSet.add(rule.params.replace(/['"]/g, ''));
  });

  // Add new imports from addon
  addonRoot.walkAtRules('import', rule => {
    const cleaned = rule.params.replace(/['"]/g, '');
    if (!importSet.has(cleaned)) {
      importSet.add(cleaned);
      targetRoot.prepend(rule.clone());
    }
  });

  // Append other nodes (rules, declarations, etc.)
  addonRoot.nodes?.forEach(node => {
    // Only append if it's not an @import rule
    if (!(node.type === 'atrule' && node.name === 'import')) {
      // Make sure it's a child node (exclude Root)
      if ('clone' in node && typeof node.clone === 'function') {
        targetRoot.append(node.clone());
      }
    }
  });

  const result = targetRoot.toResult().css;
  await fs.writeFile(targetFile, result, 'utf8');
}