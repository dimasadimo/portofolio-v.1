import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.next', 'out', 'dist', 'node_modules', 'public', 'next-env.d.ts'] },

  // Type-checked linting for app source only.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // CONVENTIONS.md §13 — errors, not warnings
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // §10 — no enum
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use an `as const` object + derived union instead of enum (§10).',
        },
      ],

      // §13 — auto-sorted imports: external -> @/ -> relative
      'simple-import-sort/imports': [
        'error',
        { groups: [['^\\u0000'], ['^node:', '^@?\\w'], ['^@/'], ['^\\.']] },
      ],
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Next.js route files must export generateMetadata / generateStaticParams / metadata
  // alongside the default component — react-refresh's rule does not apply to them.
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/proxy.ts', 'src/i18n/**/*.ts'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Root TypeScript config files: typed linting, Node globals.
  {
    files: ['*.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },

  // Plain JS config files: no type-aware rules.
  {
    files: ['*.{config,setup}.{mjs,js}', 'eslint.config.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
);
