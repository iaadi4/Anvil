import {
  intro,
  outro,
  select,
  multiselect,
  text,
  isCancel,
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
};

export async function cli() {
  intro(chalk.bold.blue("Create Web Stack CLI"));

  console.log(
    `${prefix.input} Please enter a name for your project directory.\n`
  );

  const projectDir = await text({
    message: "Project directory name:",
    placeholder: "my-app",
    validate: (input) =>
      input.trim() === "" ? "Project directory name is required." : undefined,
  });

  if (isCancel(projectDir)) {
    outro(`${prefix.warn} Operation cancelled.`);
    process.exit(0);
  }

  console.log(`\n${prefix.input} Select a framework:\n`);

  const selectedFramework = await select({
    message: "Framework:",
    options: frameworks.map((f) => ({ label: f.name, value: f.value })),
  });

  if (isCancel(selectedFramework)) {
    outro(`${prefix.warn} Operation cancelled.`);
    process.exit(0);
  }

  const isReact = selectedFramework.startsWith("react");
  let selectedAddons: string[] = [];

  if (isReact) {
    const tailwind = await select({
      message: "Include Tailwind CSS?",
      options: [
        { label: "Yes", value: "tailwind" },
        { label: "No", value: null },
      ],
    });
    if (tailwind) selectedAddons.push(tailwind as string);

    const styleChoices = addons.styling.filter((a) => {
      if (a.value === "shadcn") {
        return (
          selectedAddons.includes("tailwind") &&
          selectedFramework.includes("ts")
        );
      }
      if (a.value === "daisyui") {
        return selectedAddons.includes("tailwind");
      }
      return a.value !== "tailwind";
    });

    const style = await select({
      message: "Choose a styling library:",
      options: [
        ...styleChoices.map((a) => ({ label: a.name, value: a.value })),
        { label: "None", value: null },
      ],
    });
    if (style) selectedAddons.push(style as string);

    const backend = await select({
      message: "Include backend support (Express)?",
      options: [
        { label: "Yes", value: "express" },
        { label: "No", value: null },
      ],
    });
    if (backend) selectedAddons.push(backend as string);

    let selectedOrm: string | null = null;

    const orm = await select({
      message: "Select a ORM:",
      options: [
        ...addons.orm.map((d) => ({ label: d.name, value: d.value })),
        { label: "None", value: null },
      ],
    });

    if (orm === "prisma") {
      selectedAddons.push("prisma");
      const ormChoice = await select({
        message: "Choose a database for Prisma:",
        options: [
          { label: "PostgreSQL", value: "postgresql" },
          { label: "MySQL", value: "mysql" },
          { label: "SQLite", value: "sqlite" },
        ],
      });

      if (isCancel(ormChoice)) {
        console.log("Operation cancelled.");
        process.exit(0);
      }

      selectedOrm = ormChoice;

      const extras = await multiselect({
        message: "Select additional tools:",
        options: [
          ...addons.extras.map((e) => ({ label: e.name, value: e.value })),
          { label: "None", value: null },
        ],
      });

      if (!isCancel(extras)) {
        selectedAddons.push(
          ...(extras.filter((e) => typeof e === "string") as string[])
        );
      }

      console.log("\n" + chalk.bold(`${prefix.info} Stack Summary:`));
      console.log(`${prefix.info} Project    :`, chalk.white(projectDir));
      console.log(
        `${prefix.info} Framework  :`,
        chalk.white(selectedFramework)
      );
      console.log(
        `${prefix.info} Addons     :`,
        selectedAddons.length
          ? chalk.white(selectedAddons.join(", "))
          : chalk.gray("None")
      );
      console.log("");

      await generateProject(
        selectedFramework,
        selectedAddons,
        projectDir,
        selectedOrm ?? undefined
      );
    }
  }

  if (!isReact) {
    const auth = await select({
      message: "Choose an auth provider:",
      options: [
        ...addons.auth.map((a) => ({ label: a.name, value: a.value })),
        { label: "None", value: null },
      ],
    });
    if (auth) selectedAddons.push(auth as string);
  }

  outro(`${prefix.done} Project successfully created at ./${projectDir}`);
}
