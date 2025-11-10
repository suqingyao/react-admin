import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  typescript: true,
  ignores: [
    'dist',
    'node_modules',
  ],
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
});
