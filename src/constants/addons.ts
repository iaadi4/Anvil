export const addons = {
  styling: [
    { name: 'Tailwind CSS', value: 'tailwind', requires: [] },
    { name: 'Shadcn UI', value: 'shadcn', requires: ['tailwind', 'typescript'] },
  ],
  backend: [
    { name: 'Express', value: 'express', requires: [] },
  ],
  database: [
    { name: 'Prisma', value: 'prisma', requires: ['backend'] },
  ],
  auth: [
    { name: 'NextAuth', value: 'next-auth', requires: ['database'] },
    { name: 'BetterAuth', value: 'better-auth', requires: ['database'] },
  ],
  extras: [
    { name: 'ESLint + Prettier', value: 'eslint-prettier', requires: [] },
    { name: 'Docker', value: 'docker', requires: [] },
  ]
};