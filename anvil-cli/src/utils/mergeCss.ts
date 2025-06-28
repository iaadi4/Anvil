import postcss from 'postcss';
import safeParse from 'postcss-safe-parser';
import fs from 'fs-extra';

/**
 * Merge two CSS files:
 * - @import statements go at the very top
 * - @plugin statements go after @import
 * - All other rules go to the bottom
 * - If addon file starts with /*override*\/, it replaces the target file
 */
export async function mergeCssFiles(targetFile: string, addonFile: string) {
  const [targetExists, addonExists] = await Promise.all([
    fs.pathExists(targetFile),
    fs.pathExists(addonFile),
  ]);

  if (!addonExists) return;
  let addonCss = await fs.readFile(addonFile, 'utf8');

  // Check for override directive
  if (/^\s*\/\*override\*\//.test(addonCss)) {
    addonCss = addonCss.replace(/^\s*\/\*override\*\/\s*/, '');
    await fs.writeFile(targetFile, addonCss, 'utf8');
    return;
  }

  if (!targetExists) {
    await fs.copy(addonFile, targetFile);
    return;
  }

  const targetCss = await fs.readFile(targetFile, 'utf8');

  const targetRoot = safeParse(targetCss);
  const addonRoot = safeParse(addonCss);

  const importSet = new Set<string>();
  const pluginSet = new Set<string>();
  const importNodes: postcss.AtRule[] = [];
  const pluginNodes: postcss.AtRule[] = [];
  const otherNodes: postcss.ChildNode[] = [];

  const ensureNewline = (node: postcss.ChildNode) => {
    node.raws = node.raws || {};
    node.raws.before = '\n';
    node.raws.after = '\n';
    return node;
  };

  // Collect import/plugin rules from target
  targetRoot.walkAtRules(rule => {
    const cleaned = rule.params.replace(/['"\s]/g, '').replace(/^url\((.*)\)$/, '$1');
    if (rule.name === 'import') importSet.add(cleaned);
    if (rule.name === 'plugin') pluginSet.add(cleaned);
  });

  // Extract new nodes from addon
  addonRoot.nodes?.forEach(node => {
    if (node.type === 'atrule') {
      const cleaned = node.params.replace(/['"\s]/g, '').replace(/^url\((.*)\)$/, '$1');
      if (node.name === 'import' && !importSet.has(cleaned)) {
        importSet.add(cleaned);
        importNodes.push(ensureNewline(node.clone()) as postcss.AtRule);
        return;
      }
      if (node.name === 'plugin' && !pluginSet.has(cleaned)) {
        pluginSet.add(cleaned);
        pluginNodes.push(ensureNewline(node.clone()) as postcss.AtRule);
        return;
      }
    }
    if ('clone' in node && typeof node.clone === 'function') {
      otherNodes.push(ensureNewline(node.clone() as postcss.ChildNode));
    }
  });

  // Final root node
  const finalRoot = postcss.root();

  // Add target @imports
  targetRoot.nodes?.forEach(node => {
    if (node.type === 'atrule' && node.name === 'import') {
      finalRoot.append(ensureNewline(node.clone()));
    }
  });

  // Add new @imports
  importNodes.forEach(node => finalRoot.append(node));

  // Add target @plugins
  targetRoot.nodes?.forEach(node => {
    if (node.type === 'atrule' && node.name === 'plugin') {
      finalRoot.append(ensureNewline(node.clone()));
    }
  });

  // Add new @plugins
  pluginNodes.forEach(node => finalRoot.append(node));

  // Add all other rules from target
  targetRoot.nodes?.forEach(node => {
    if (!(node.type === 'atrule' && (node.name === 'import' || node.name === 'plugin'))) {
      finalRoot.append(ensureNewline(node.clone() as postcss.ChildNode));
    }
  });

  // Add other rules from addon
  otherNodes.forEach(node => finalRoot.append(node));

  const result = finalRoot.toString();
  await fs.writeFile(targetFile, result, 'utf8');
}