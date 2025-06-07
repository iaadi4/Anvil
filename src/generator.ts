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
    framework: string,
    addons: string[],
    projectDir: string,
    dbType?: string
) {
    const outputPath = path.join(process.cwd(), projectDir);
    const hasExpress = addons.includes('express');
    const isReact = framework.startsWith('react');
    const usingClientServerStructure = isReact && hasExpress;

    const clientPath = usingClientServerStructure
        ? path.join(outputPath, 'client')
        : outputPath;
    const serverPath = usingClientServerStructure
        ? path.join(outputPath, 'server')
        : null;

    const frameworkPath = path.join(TEMPLATE_DIR, 'frameworks', framework);

    const spinner = ora(`Creating project at ${projectDir}...`).start();
    try {
        await fs.ensureDir(outputPath);
        await fs.copy(frameworkPath, clientPath);
        await delay(300);
        spinner.succeed(
            `${prefix.success} Framework scaffolded to ${path.relative(
                process.cwd(),
                clientPath
            )}`
        );
        console.log('\n');
    } catch (err) {
        spinner.fail(`${prefix.error} Failed to scaffold base framework.`);
        console.error(prefix.error, err);
        process.exit(1);
    }

    for (const addon of addons) {
        const addonPath = findAddonPath(addon);
        if (!addonPath) {
            console.warn(`${prefix.warn} Skipping unknown addon: ${addon}`);
            continue;
        }

        const isBackend = addon === 'express';

        const targetPath =
            addon === 'prisma'
                ? isReact && hasExpress && serverPath
                    ? path.join(serverPath)
                    : path.join(clientPath)
                : isBackend && serverPath
                    ? serverPath
                    : clientPath;

        const addonSpinner = ora(`Integrating addon: ${addon} \n`).start();
        try {
            const files = await getAllFiles(addonPath);

            for (const file of files) {
                const relPath = path.relative(addonPath, file);
                const destPath = path.join(targetPath, relPath);

                if (!fs.existsSync(destPath)) {
                    await fs.ensureDir(path.dirname(destPath));
                    await fs.copy(file, destPath);
                    console.log(`${prefix.info} New file added: ${relPath}`);
                } else {
                    if (file.endsWith('vite.config.ts')) {
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
                        console.log(`${prefix.info} Merged .env.example`);
                    } else {
                        console.warn(
                            `${prefix.warn} Skipping unsupported file type: ${relPath}`
                        );
                    }
                }
            }

            // Prisma special handling
            if (addon === 'prisma' && dbType) {
                const envPath = path.join(outputPath, 'server', '.env.example');
                const schemaPath = path.join(targetPath, 'prisma', 'schema.prisma');

                const provider = dbType;
                const connectionString = {
                    postgresql: 'postgresql://user:password@localhost:5432/dbname',
                    mysql: 'mysql://user:password@localhost:3306/dbname',
                    sqlite: 'file:./dev.db',
                }[dbType];

                if (await fs.pathExists(schemaPath)) {
                    let schema = await fs.readFile(schemaPath, 'utf-8');

                    const updated = schema.replace(
                        /provider = ["']\{\{provider\}\}["']/,
                        `provider = "${provider}"`
                    );

                    if (updated !== schema) {
                        await fs.writeFile(schemaPath, updated);
                        console.log(`${prefix.info} Updated Prisma provider to ${provider}`);
                    } else {
                        console.warn(`${prefix.warn} No provider placeholder found in schema.prisma`);
                    }
                }

                let env = '';
                if (await fs.pathExists(envPath)) {
                    env = await fs.readFile(envPath, 'utf-8');
                }

                // Replace any existing DATABASE_URL line, or add it if missing
                const updatedEnv = env.match(/^DATABASE_URL=.*$/m)
                    ? env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${connectionString}"`)
                    : env + `\nDATABASE_URL="${connectionString}"\n`;

                await fs.writeFile(envPath, updatedEnv);
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

function findAddonPath(addonName: string): string | null {
    const groups = ['styling', 'backend', 'database', 'auth', 'extras'];
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