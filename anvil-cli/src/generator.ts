import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import ora from "ora";
import chalk from "chalk";
import { execa } from "execa";
import { mergeCssFiles } from "./utils/mergeCss";
import { mergeCodeFiles } from "./utils/mergeCode";
import { mergeJsonFiles } from "./utils/mergeJson";
import { mergeViteConfigs } from "./utils/mergeViteConfig";
import { addons } from "./constants/addons";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_DIR = path.join(__dirname, "..", "templates");

const prefix = {
  info: chalk.blueBright("[INFO]"),
  warn: chalk.hex("#FFA500")("[WARN]"),
  error: chalk.red("[ERROR]"),
  success: chalk.green("[SUCCESS]"),
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateProject(
  frameworkName: string,
  framework: string,
  selectedAddons: string[],
  projectDir: string,
  packageManager: "pnpm" | "npm" | "yarn"
) {
  const projectPath = path.join(process.cwd(), projectDir);
  const tempDir = path.join(process.cwd(), `.temp-${projectDir}`);
  const frameworkPath = path.join(TEMPLATE_DIR, "frameworks", framework);

  if (fs.existsSync(projectPath)) {
    console.error(
      `\n${prefix.error} Directory '${projectDir}' already exists.`
    );
    process.exit(1);
  }

  const scaffoldSpinner = ora(`Scaffolding '${projectDir}'...`).start();

  try {
    // 1. Scaffold framework into a temporary directory
    await fs.ensureDir(tempDir);
    await fs.copy(frameworkPath, tempDir);
    await delay(300);
    scaffoldSpinner.succeed(
      `${prefix.success} Framework scaffolded successfully.`
    );

    // 2. Integrate addons in the temporary directory
    for (const addon of selectedAddons) {
      const addonPath = findAddonPath(addon, frameworkName);
      if (!addonPath) {
        console.warn(`${prefix.warn} Skipping unknown addon: ${addon}`);
        continue;
      }
      const addonSpinner = ora(`Integrating addon: ${addon}`).start();
      try {
        await integrateAddon(addonPath, tempDir);
        await delay(200);
        addonSpinner.succeed(`${prefix.success} Addon '${addon}' integrated.`);
      } catch (err) {
        addonSpinner.fail(
          `${prefix.error} Failed to integrate addon: ${addon}`
        );
        throw err; // Propagate error to the main catch block
      }
    }

    // 3. Move from temp to final destination
    const moveSpinner = ora("Finalizing project structure...").start();
    await fs.move(tempDir, projectPath);
    moveSpinner.succeed(`${prefix.success} Project moved to '${projectDir}'.`);

    // 4. Install dependencies
    const installSpinner = ora(
      `Installing dependencies with ${packageManager}...`
    ).start();
    const installProcess = execa(packageManager, ["install"], {
      cwd: projectPath,
    });
    installProcess.stdout?.pipe(process.stdout);
    await installProcess;
    installSpinner.succeed(
      `${prefix.success} Dependencies installed successfully.`
    );

    console.log(`\n${prefix.success} Project setup completed successfully.`);
  } catch (err) {
    console.error(`\n${prefix.error} An error occurred:`, err);
    scaffoldSpinner.fail(`${prefix.error} Project creation failed.`);
    // Clean up the temporary directory on failure
    if (fs.existsSync(tempDir)) {
      await fs.remove(tempDir);
    }
    process.exit(1);
  }
}

async function integrateAddon(addonPath: string, projectDir: string) {
  const files = await getAllFiles(addonPath);
  for (const file of files) {
    const relPath = path.relative(addonPath, file);
    const destPath = path.join(projectDir, relPath);

    if (!fs.existsSync(destPath)) {
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(file, destPath);
    } else {
      let fileContent = await fs.readFile(file, "utf-8");
      if (/^\s*\/\*override\*\//.test(fileContent)) {
        fileContent = fileContent.replace(/^\s*\/\*override\*\/\s*/, "");
        await fs.writeFile(destPath, fileContent, "utf8");
      } else if (file.endsWith("vite.config.ts")) {
        await mergeViteConfigs(destPath, file);
      } else if (file.endsWith(".css")) {
        await mergeCssFiles(destPath, file);
      } else if (/\.(ts|js|tsx|jsx)$/.test(file)) {
        await mergeCodeFiles(destPath, file);
      } else if (file.endsWith(".json")) {
        await mergeJsonFiles(destPath, file);
      } else if (file.endsWith(".env") || file.endsWith(".env.example")) {
        const original = await fs.readFile(destPath, "utf-8");
        const incoming = await fs.readFile(file, "utf-8");
        const merged = original + "\n" + incoming;
        await fs.writeFile(destPath, merged);
      } else {
        console.warn(
          `${prefix.warn} Unhandled file merge: ${relPath}. Overwriting.`
        );
        await fs.copy(file, destPath, { overwrite: true });
      }
    }
  }
}

function findAddonPath(
  addonName: string,
  frameworkName: string
): string | null {
  const possibleGroups = [
    `styling/${frameworkName}`,
    `orm/${frameworkName}`,
    `auth/${frameworkName}`,
    `backend`,
    `styling/react`, // Fallback for react addons
    `orm/react`,
    `auth/react`,
    "extras",
  ];

  for (const group of possibleGroups) {
    const possiblePath = path.join(TEMPLATE_DIR, "addons", group, addonName);
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }

  // Generic fallback
  const genericPath = path.join(TEMPLATE_DIR, "addons", addonName);
  if (fs.existsSync(genericPath)) {
    return genericPath;
  }

  return null;
}

async function getAllFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getAllFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}