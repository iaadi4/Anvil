#!/usr/bin/env node

import { intro, outro, text, select, confirm, isCancel } from "@clack/prompts";
import chalk from "chalk";

async function main() {
  intro(chalk.cyan("🛠️  Welcome to Anvil"));

  const project = await text({
    message: "What do you want to name your project?",
    placeholder: "my-app",
  });

  if (isCancel(project)) {
    outro("Operation cancelled.");
    process.exit(0);
  }

  const mainFramework = await select({
    message: "Select a main framework",
    options: [
      { value: "react", label: "React (Vite)" },
      { value: "next", label: "Next.js" },
    ],
  });

  if (isCancel(mainFramework)) {
    outro("Operation cancelled.");
    process.exit(0);
  }

  let options = {};

  if (mainFramework === "react") {
    const useTailwind = await confirm({
      message: "Do you want to use Tailwind CSS?",
      initialValue: true,
    });
    if (isCancel(useTailwind)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    const useShadcn = await confirm({
      message: "Do you want to add shadcn UI components?",
      initialValue: false,
    });
    if (isCancel(useShadcn)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    const useExpress = await confirm({
      message: "Do you want to add Express backend?",
      initialValue: false,
    });
    if (isCancel(useExpress)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    options = { useTailwind, useShadcn, useExpress };
  } else if (mainFramework === "next") {
    const authProvider = await select({
      message: "Choose an authentication provider",
      options: [
        { value: "better-auth", label: "BetterAuth" },
        { value: "next-auth", label: "NextAuth" },
        { value: "clerk", label: "Clerk" },
        { value: "none", label: "None" },
      ],
    });
    if (isCancel(authProvider)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    const useShadcn = await confirm({
      message: "Do you want to add shadcn UI components?",
      initialValue: true,
    });
    if (isCancel(useShadcn)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    const usePrisma = await confirm({
      message: "Do you want to add Prisma ORM?",
      initialValue: true,
    });
    if (isCancel(usePrisma)) {
      outro("Operation cancelled.");
      process.exit(0);
    }

    options = { authProvider, useShadcn, usePrisma };
  }

  console.log(chalk.green(`\nCreating project '${project}' with:`));
  console.log(chalk.green(`- Framework: ${mainFramework}`));
  console.log(chalk.green(`- Options: ${JSON.stringify(options, null, 2)}`));

  outro("Happy coding! 🚀");
}

main();
