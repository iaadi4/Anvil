import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { mergeCssFiles } from './utils/mergeCss';
import { mergeCodeFiles } from './utils/mergeCode';
import { mergeJsonFiles } from './utils/mergeJson';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');

export async function generateProject(framework: string, addons: string[], projectDir: string) {
  const frameworkPath = path.join(TEMPLATE_DIR, 'frameworks', framework);
  const outputPath = path.join(process.cwd(), projectDir);

  console.log(chalk.blue(`🧱 Generating project at ${chalk.bold(outputPath)}`));

  await fs.copy(frameworkPath, outputPath);
  console.log(chalk.green(`✅ Base framework copied.`));

  for (const addon of addons) {
    const addonPath = findAddonPath(addon);
    if (!addonPath) {
      console.warn(chalk.yellow(`⚠️  Skipping unknown addon: ${addon}`));
      continue;
    }

    console.log(chalk.cyan(`➕ Adding addon: ${chalk.bold(addon)}...`));

    const files = await getAllFiles(addonPath);

    for (const file of files) {
      const relPath = path.relative(addonPath, file);
      const destPath = path.join(outputPath, relPath);

      if (!fs.existsSync(destPath)) {
        await fs.ensureDir(path.dirname(destPath));
        await fs.copy(file, destPath);
        console.log(chalk.gray(`📄 Added new file: ${relPath}`));
      } else {
        if (file.endsWith('.css')) {
          await mergeCssFiles(destPath, file);
          console.log(chalk.gray(`🔀 Merged CSS: ${relPath}`));
        } else if (/\.(ts|js|tsx|jsx)$/.test(file)) {
          await mergeCodeFiles(destPath, file);
          console.log(chalk.gray(`🔀 Merged code: ${relPath}`));
        } else if (file.endsWith('.json')) {
          await mergeJsonFiles(destPath, file);
          console.log(chalk.gray(`🔀 Merged JSON: ${relPath}`));
        } else {
          console.warn(chalk.yellow(`⏭️  Skipping unsupported file type: ${relPath}`));
        }
      }
    }
  }

  console.log(chalk.green(`\n🚀 Project setup complete.`));
}

function findAddonPath(addonName: string): string | null {
  const groups = ['styling', 'backend', 'database', 'auth', 'extras'];
  for (const group of groups) {
    const possible = path.join(__dirname, '..', 'templates', 'addons', group, addonName);
    if (fs.existsSync(possible)) return possible;
  }
  return null;
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}