import { FlatCompat } from '@eslint/eslintrc';
// https://html-eslint.org/
// npm install --save-dev eslint @html-eslint/parser @html-eslint/eslint-plugin eslint-config-prettier
// import html from 'eslint-plugin-html';
// import htmles from '@html-eslint/eslint-plugin';
// import PARSER_HTML from '@html-eslint/parser';

import eslintConfigPrettier from 'eslint-config-prettier';
// import css from '@eslint/css';
// import tailwind from 'eslint-plugin-tailwindcss';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)

  ...compat.config({
    extends: [
      // 'next/core-web-vitals',
      'next/typescript',
    ],
    settings: {
      next: {
        rootDir: 'app/',
      },
    },
  }),

  // lint CSS files
  // {
  //   files: ['**/*.css'],
  //   language: 'css/css',
  //   ...css.configs.recommended,
  // },

  //  ...tailwind.configs['flat/recommended'],

  {
    // recommended configuration included in the plugin
    files: ['app/**/*.{js,mjs,cjs,jsx,tsx,ts}'],

    rules: {
      'no-unexpected-multiline': 'off', // 关闭规则
      '@typescript-eslint/no-unused-vars': 'warn',
      // "react/react-in-jsx-scope": "off",
      // "react/jsx-uses-react": "off",
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;
