export const frameworks = [
  {
    name: 'React with TypeScript',
    value: 'react-with-ts',
    type: 'react',
  },
  {
    name: 'Next.js with TypeScript',
    value: 'next-with-ts',
    type: 'next',
  },
] as const;

export type FrameworkValue = typeof frameworks[number]['value'];
export type FrameworkType = typeof frameworks[number]['type'];
