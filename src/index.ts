#!/usr/bin/env node

import { intro, outro, text } from "@clack/prompts";
import chalk from "chalk";

async function main() {
  intro(chalk.cyan("🛠️  Welcome to Anvil"));

  const project = await text({
    message: "What do you want to name your project?",
    placeholder: "my-app"
  });

  console.log(chalk.green(`Creating project: ${String(project)}`));

  outro("See you soon 👋");
}

main();
