export const SCHEMES = [
  { name: 'Default', value: 'default' },
  { name: 'Claude', value: 'claude' },
  { name: 'Supabase', value: 'supabase' },
  { name: 'Vercel', value: 'vercel' },
  { name: 'Mono', value: 'mono' },
  { name: 'Notebook', value: 'notebook' },
  { name: 'Custom', value: 'custom' }
] as const;

export type SchemeName = (typeof SCHEMES)[number]['value'];
