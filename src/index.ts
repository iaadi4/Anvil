#!/usr/bin/env node

import { intro, outro, text, select, confirm, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mergePackageJson(targetDir: string, addonDir: string) {
  const targetPkgPath = path.join(targetDir, 'package.json');
  const addonPkgPath = path.join(addonDir, 'package.json');

  if (!(await fs.pathExists(addonPkgPath))) return;

  const targetPkg = await fs.readJson(targetPkgPath);
  const addonPkg = await fs.readJson(addonPkgPath);

  targetPkg.dependencies = {
    ...targetPkg.dependencies,
    ...addonPkg.dependencies,
  };

  targetPkg.devDependencies = {
    ...targetPkg.devDependencies,
    ...addonPkg.devDependencies,
  };

  await fs.writeJson(targetPkgPath, targetPkg, { spaces: 2 });
}

async function prependIndexCss(targetDir: string, addonDir: string) {
  const targetCssPath = path.join(targetDir, 'src', 'index.css');
  const addonCssPath = path.join(addonDir,'src', 'index.css');

  if (!(await fs.pathExists(addonCssPath))) return;

  const tailwindImports = (await fs.readFile(addonCssPath, 'utf8')).trim();

  let existingCss = '';
  if (await fs.pathExists(targetCssPath)) {
    existingCss = await fs.readFile(targetCssPath, 'utf8');
  }

  const alreadyIncludesTailwind = existingCss.includes('@import "tailwindcss";');

  const newCss = alreadyIncludesTailwind
    ? existingCss
    : `${tailwindImports}\n\n${existingCss.trim()}`;

  await fs.outputFile(targetCssPath, newCss.trim());
}

async function applySnippets(targetDir: string, addonDir: string) {
  const files = await fs.readdir(addonDir);

  const snippetFiles = files.filter(
    (f) => f.endsWith('.snippet.ts') || f.endsWith('.snippet.js')
  );

  for (const file of snippetFiles) {
    const fullPath = path.join(addonDir, file);
    let content = await fs.readFile(fullPath, 'utf8');

    content = content.trim().replace(/^['"`]\s*|['"`]\s*$/g, '');

    const newFileName = file.replace('.snippet', '');
    const destPath = path.join(targetDir, newFileName);
    await fs.writeFile(destPath, content);
  }
}

async function applyTailwindAddon(targetDir: string) {
  const addonDir = path.join(__dirname, '../templates/addons/styling/tailwind');
  await mergePackageJson(targetDir, addonDir);
  await prependIndexCss(targetDir, addonDir);
  await applySnippets(targetDir, addonDir);
}

async function copyBaseTemplate(targetDir: string, framework: string) {
  const baseDir = path.join(__dirname, '../templates/base', framework);
  await fs.copy(baseDir, targetDir);
}

async function main() {
  intro(chalk.cyan('🛠️ Welcome to Anvil'));

  const project = await text({
    message: 'What do you want to name your project?',
    placeholder: 'my-app',
  });

  if (isCancel(project)) {
    outro('Operation cancelled.');
    process.exit(0);
  }

  const mainFramework = await select({
    message: 'Select a main framework',
    options: [
      { value: 'react-with-ts', label: 'React (Vite + TypeScript)' },
    ],
  });

  if (isCancel(mainFramework)) {
    outro('Operation cancelled.');
    process.exit(0);
  }

  const useTailwind = await confirm({
    message: 'Do you want to use Tailwind CSS?',
    initialValue: true,
  });

  if (isCancel(useTailwind)) {
    outro('Operation cancelled.');
    process.exit(0);
  }

  const targetPath = path.resolve(process.cwd(), String(project));
  await copyBaseTemplate(targetPath, mainFramework);

  if (useTailwind) {
    await applyTailwindAddon(targetPath);
  }

  outro(chalk.green(`✅ Project "${project}" created successfully!`));
}

main().catch((err) => {
  console.error(chalk.red('❌ An error occurred:'), err);
  process.exit(1);
});
