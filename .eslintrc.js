
// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'unused-imports'],
    extends: [
      'next',
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      // 🚫 Remove unused imports
      'unused-imports/no-unused-imports': 'error',
  
      // 🚫 Remove unused vars (optionally allow _ prefixed vars)
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
  
      // ✅ Turn off default unused-vars rule to prevent conflicts
      '@typescript-eslint/no-unused-vars': 'off',
    },
  };
  