import {
  intro,
  outro,
  select,
  multiselect,
  text,
  isCancel,
  cancel,
} from "@clack/prompts";
import { frameworks } from "./constants/frameworks";
import { addons } from "./constants/addons";
import { generateProject } from "./generator";
import chalk from "chalk";

const prefix = {
  input: chalk.cyanBright("[INPUT]"),
  info: chalk.blueBright("[INFO]"),
  step: chalk.yellowBright("[STEP]"),
  done: chalk.green("[DONE]"),
  warn: chalk.hex("#FFA500")("[WARN]"),
  error: chalk.redBright("[ERROR]"),
};

const handleCancel = (value: unknown) => {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
};

export async function cli() {
  try {
    intro(chalk.bold.blue("Create Anvil App"));

    const projectDir = await text({
      message: "Enter a name for your project directory:",
      placeholder: "my-app",
      validate: (input) => {
        if (!input) return "Project directory name is required.";
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return "Project name can only contain letters, numbers, hyphens, and underscores.";
        }
      },
    });
    handleCancel(projectDir);

    const packageManager = (await select({
      message: "Select a package manager:",
      options: [
        { label: "pnpm", value: "pnpm" },
        { label: "npm", value: "npm" },
        { label: "yarn", value: "yarn" },
      ],
    })) as "pnpm" | "npm" | "yarn";
    handleCancel(packageManager);


    const selectedFramework = await select({
      message: "Select a framework:",
      options: frameworks.map((f) => ({ label: f.name, value: f.value })),
    });
    handleCancel(selectedFramework);

    const framework = selectedFramework as string;
    const isTypescript = framework.includes("ts");
    const isNext = framework.startsWith("next");
    const selectedAddons: string[] = [];

    const backend = await select({
      message: "Add a backend?",
      options: [
        ...addons.backend.map((b) => ({ label: b.name, value: b.value })),
        { label: "None", value: null },
      ],
    });
    handleCancel(backend);
    if (backend) selectedAddons.push(backend);

    const tailwind = await select({
      message: "Include Tailwind CSS?",
      options: [
        { label: "Yes", value: "tailwind" },
        { label: "No", value: null },
      ],
    });
    handleCancel(tailwind);
    if (tailwind) selectedAddons.push(tailwind);

    const stylingOptions = addons.styling.filter((a) => {
      const isTailwindDependent = ["shadcn", "daisyui"].includes(a.value);
      if (a.value === "tailwind") return false; // Already handled
      if (isTailwindDependent) return selectedAddons.includes("tailwind");
      if (a.value === "nextui") return isNext;
      return true;
    });

    if (stylingOptions.length > 0) {
      const style = await select({
        message: "Choose a styling library:",
        options: [
          ...stylingOptions.map((s) => ({ label: s.name, value: s.value })),
          { label: "None", value: null },
        ],
      });
      handleCancel(style);
      if (style) selectedAddons.push(style);
    }

    const ormOptions = addons.orm.filter((o) => isNext || o.value === "drizzle");
    if (ormOptions.length > 0) {
      const orm = await select({
        message: "Choose an ORM:",
        options: [
          ...ormOptions.map((o) => ({ label: o.name, value: o.value })),
          { label: "None", value: null },
        ],
      });
      handleCancel(orm);
      if (orm) selectedAddons.push(orm);
    }

    const authOptions = addons.auth.filter(
      (a) => isNext || a.value === "clerk"
    );
    if (authOptions.length > 0) {
      const auth = await select({
        message: "Choose an auth provider:",
        options: [
          ...authOptions.map((a) => ({ label: a.name, value: a.value })),
          { label: "None", value: null },
        ],
      });
      handleCancel(auth);
      if (auth) selectedAddons.push(auth);
    }

    const extras = await multiselect({
      message: "Select additional tools:",
      options: addons.extras.map((e) => ({ label: e.name, value: e.value })),
      required: false,
    });
    handleCancel(extras);
    if (extras) selectedAddons.push(...(extras as string[]));

    console.log("\n" + chalk.bold(`${prefix.info} Stack Summary:`));
    console.log(`${prefix.info} Project    :`, chalk.white(projectDir));
    console.log(`${prefix.info} Framework  :`, chalk.white(framework));
    console.log(
      `${prefix.info} Package Manager  :`,
      chalk.white(packageManager)
    );
    console.log(
      `${prefix.info} Addons     :`,
      selectedAddons.length
        ? chalk.white(selectedAddons.join(", "))
        : chalk.gray("None")
    );
    console.log("");

    const frameworkName = framework.split("-")[0];
    await generateProject(
      frameworkName,
      framework,
      selectedAddons,
      projectDir,
      packageManager
    );

    outro(
      `${prefix.done} Project successfully created at ./${projectDir}`
    );
  } catch (error) {
    console.error(`\n${prefix.error} An unexpected error occurred:`, error);
    outro(`${prefix.warn} Project creation failed.`);
    process.exit(1);
  }
}

