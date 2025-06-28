import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import ora from 'ora';
import chalk from 'chalk';
import { mergeCssFiles } from './utils/mergeCss';
import { mergeCodeFiles } from './utils/mergeCode';
import { mergeJsonFiles } from './utils/mergeJson';
import { mergeViteConfigs } from './utils/mergeViteConfig';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, '..', 'templates');

const prefix = {
    info: chalk.blueBright('[INFO]'),
    warn: chalk.hex('#FFA500')('[WARN]'),
    error: chalk.red('[ERROR]'),
    success: chalk.green('[SUCCESS]'),
};

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateProject(
    frameworkName: string,
    framework: string,
    addons: string[],
    projectDir: string,
    dbType?: string
) {
    const outputPath = path.join(process.cwd(), projectDir);
    const frameworkPath = path.join(TEMPLATE_DIR, 'frameworks', framework);

    const spinner = ora(`Creating project at ${projectDir}...`).start();
    try {
        await fs.ensureDir(outputPath);
        await fs.copy(frameworkPath, outputPath);
        await delay(300);
        spinner.succeed(
            `${prefix.success} Framework scaffolded to ${path.relative(
                process.cwd(),
                outputPath
            )}`
        );
        console.log('\n');
    } catch (err) {
        spinner.fail(`${prefix.error} Failed to scaffold base framework.`);
        console.error(prefix.error, err);
        process.exit(1);
    }

    for (const addon of addons) {
        const addonPath = findAddonPath(addon, frameworkName);
        if (!addonPath) {
            console.warn(`${prefix.warn} Skipping unknown addon: ${addon}`);
            continue;
        }

        const addonSpinner = ora(`Integrating addon: ${addon} \n`).start();
        try {
            const files = await getAllFiles(addonPath);

            for (const file of files) {
                const relPath = path.relative(addonPath, file);
                const destPath = path.join(outputPath, relPath);

                if (!fs.existsSync(destPath)) {
                    await fs.ensureDir(path.dirname(destPath));
                    await fs.copy(file, destPath);
                    console.log(`${prefix.info} New file added: ${relPath}`);
                } else {
                    let fileContent = await fs.readFile(file, 'utf-8');

                    // Check for override directive
                    if (/^\s*\/\*override\*\//.test(fileContent)) {
                        fileContent = fileContent.replace(/^\s*\/\*override\*\/\s*/, '');
                        await fs.writeFile(destPath, fileContent, 'utf8');
                    } 
                    
                    else if (file.endsWith('vite.config.ts')) {
                        await mergeViteConfigs(destPath, file);
                        console.log(`${prefix.info} Merged Vite config: ${relPath}`);
                    } else if (file.endsWith('.css')) {
                        await mergeCssFiles(destPath, file);
                        console.log(`${prefix.info} Merged CSS file: ${relPath}`);
                    } else if (/\.(ts|js|tsx|jsx)$/.test(file)) {
                        await mergeCodeFiles(destPath, file);
                        console.log(`${prefix.info} Merged code file: ${relPath}`);
                    } else if (file.endsWith('.json')) {
                        await mergeJsonFiles(destPath, file);
                        console.log(`${prefix.info} Merged JSON file: ${relPath}`);
                    } else if (file.endsWith('.env.example')) {
                        const original = await fs.readFile(destPath, 'utf-8');
                        const incoming = await fs.readFile(file, 'utf-8');
                        const merged = original + '\n' + incoming;
                        await fs.writeFile(destPath, merged);
                        console.log(`${prefix.info} Merged .env`);
                    } else {
                        console.warn(
                            `${prefix.warn} Skipping unsupported file type: ${relPath}`
                        );
                    }
                }
            }

            await delay(300);
            addonSpinner.succeed(`${prefix.success} Addon '${addon}' integrated.`);
            console.log('\n');
        } catch (err) {
            addonSpinner.fail(`${prefix.error} Failed to integrate addon: ${addon}`);
            console.error(prefix.error, err);
            console.log('\n');
        }
    }

    console.log(`\n${prefix.success} Project setup completed successfully.`);
}

function findAddonPath(addonName: string, frameworkName: string): string | null {
    const groups = [`styling/${frameworkName}`, 'orm', `auth/${frameworkName}`, 'extras', 'packageManager'];
    for (const group of groups) {
        const possible = path.join(
            __dirname,
            '..',
            'templates',
            'addons',
            group,
            addonName
        );
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
            files.push(...(await getAllFiles(fullPath)));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}