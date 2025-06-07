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
    { name: 'ESLint + Prettier', value: 'eslint-prettier', requires: [] },
    { name: 'Docker', value: 'docker', requires: [] },
  ]
};