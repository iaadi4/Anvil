import { intro, outro, select, multiselect, text, isCancel } from '@clack/prompts';
import { frameworks } from './constants/frameworks';
import { addons } from './constants/addons';
import { generateProject } from './generator';
import chalk from 'chalk';

export async function cli() {
  intro(chalk.blue('✨ Create Your Web Stack'));

  // Ask for project name
  const projectDir = await text({
    message: 'What should be the name of the project directory?',
    placeholder: 'my-app',
    validate: (input) => input.trim() === '' ? 'Directory name cannot be empty.' : undefined,
  });

  if (isCancel(projectDir)) {
    outro('Cancelled.');
    process.exit(0);
  }

  const selectedFramework = await select({
    message: 'Choose a framework:',
    options: frameworks.map(f => ({ label: f.name, value: f.value })),
  });

  if (isCancel(selectedFramework)) {
    outro('Cancelled.');
    process.exit(0);
  }

  const isReact = selectedFramework.startsWith('react');
  let selectedAddons: string[] = [];

  // Tailwind?
  if (isReact) {
    const tailwind = await select({
      message: 'Do you want Tailwind CSS?',
      options: [
        { label: 'Yes', value: 'tailwind' },
        { label: 'No', value: null },
      ],
    });

    if (typeof tailwind === 'string') selectedAddons.push(tailwind);
  } else {
    selectedAddons.push('tailwind'); // Next comes with Tailwind
  }

  // Styling options
  const styleChoices = addons.styling.filter(a => {
    if (a.value === 'shadcn') {
      return selectedAddons.includes('tailwind') && selectedFramework.includes('ts');
    }
    return a.value !== 'tailwind'; // Already added separately
  });

  const style = await select({
    message: 'Choose a styling library:',
    options: [
      ...styleChoices.map(a => ({ label: a.name, value: a.value })),
      { label: 'None', value: null },
    ],
  });

  if (typeof style === 'string') selectedAddons.push(style);

  // Backend (React only)
  if (isReact) {
    const backend = await select({
      message: 'Do you want a backend?',
      options: [
        { label: 'Express', value: 'express' },
        { label: 'None', value: null },
      ],
    });

    if (typeof backend === 'string') selectedAddons.push(backend);
  }

  // Database
  const db = await select({
    message: 'Choose a database:',
    options: [
      ...addons.database.map(d => ({ label: d.name, value: d.value })),
      { label: 'None', value: null },
    ],
  });

  if (typeof db === 'string') selectedAddons.push(db);

  // Auth
  const auth = await select({
    message: 'Choose an auth provider:',
    options: [
      ...addons.auth.map(a => ({ label: a.name, value: a.value })),
      { label: 'None', value: null },
    ],
  });

  if (typeof auth === 'string') selectedAddons.push(auth);

  // Extras
  const extras = await multiselect({
    message: 'Pick extras:',
    options: [
      ...addons.extras.map(e => ({ label: e.name, value: e.value })),
      { label: 'None', value: null },
    ],
  });

  if (!isCancel(extras)) {
    selectedAddons.push(...(extras.filter(e => typeof e === 'string') as string[]));
  }

  // Done!
  console.log('');
  console.log(chalk.green('Project Name:'), projectDir);
  console.log(chalk.green('Framework:'), selectedFramework);
  console.log(chalk.green('Addons:'), selectedAddons.join(', ') || 'None');
  console.log('');

  await generateProject(selectedFramework, selectedAddons, projectDir);

  outro(chalk.cyan('🚀 Your stack is ready!'));
}
