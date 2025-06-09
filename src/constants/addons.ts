export const addons = {
  styling: [
    { name: 'Tailwind CSS', value: 'tailwind', requires: [] },
    { name: 'Shadcn UI', value: 'shadcn', requires: ['tailwind', 'typescript'] },
    { name: 'DaisyUI', value: 'daisyui', requires: ['tailwind'] },
  ],
  backend: [
    { name: 'Express', value: 'express', requires: [] },
  ],
  orm: [
    { name: 'Prisma', value: 'prisma', requires: ['backend'] },
  ],
  auth: [
    { name: 'NextAuth', value: 'next-auth', requires: ['orm'] },
    { name: 'BetterAuth', value: 'better-auth', requires: ['orm'] },
  ],
  extras: [
    { name: 'Docker', value: 'docker', requires: [] },
  ],
  packageManager: [
    { name: 'npm', value: 'npm', requires: [] }, 
    { name: 'yarn', value: 'yarn', requires: [] },
    { name: 'pnpm', value: 'pnpm', requires: [] }
  ]
};