import fs from 'fs-extra';

/**
 * Merges two vite.config.ts files:
 * - Combines unique imports
 * - Merges plugin arrays from defineConfig
 * - Merges resolve.alias entries
 * - Avoids duplicate `export default` blocks
 */
export async function mergeViteConfigs(targetFile: string, addonFile: string) {
  const [targetExists, addonExists] = await Promise.all([
    fs.pathExists(targetFile),
    fs.pathExists(addonFile),
  ]);

  if (!addonExists) return;
  if (!targetExists) {
    await fs.copy(addonFile, targetFile);
    return;
  }

  const [targetContent, addonContent] = await Promise.all([
    fs.readFile(targetFile, 'utf-8'),
    fs.readFile(addonFile, 'utf-8'),
  ]);

  // Extract imports
  const importRegex = /^import[\s\S]+?from\s+['"][^'"]+['"];?/gm;
  const imports = new Set([
    ...(targetContent.match(importRegex) || []),
    ...(addonContent.match(importRegex) || []),
  ]);

  // Extract plugins array
  const pluginsRegex = /plugins:\s*\[((.|\s)*?)\]/m;
  const getPlugins = (content: string) => {
    const match = content.match(pluginsRegex);
    if (!match) return [];
    return match[1]
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  const plugins = new Set([...getPlugins(targetContent), ...getPlugins(addonContent)]);

  // Extract alias entries
  const aliasRegex = /alias:\s*\{([\s\S]*?)\}/m;
  const getAlias = (content: string) => {
    const match = content.match(aliasRegex);
    if (!match) return [];
    return match[1]
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);
  };

  const aliases = new Set([...getAlias(targetContent), ...getAlias(addonContent)]);

  // Build final config
  const result = `
${[...imports].join('\n')}

export default defineConfig({
  plugins: [${[...plugins].join(', ')}],
  resolve: {
    alias: {
      ${[...aliases].join(',\n      ')}
    }
  }
})
`.trim();

  await fs.writeFile(targetFile, result, 'utf-8');
}
