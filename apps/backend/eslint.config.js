// const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config({
//   eslint.configs.recommended,
  files: ['src/**/*.ts'],
  ...tseslint.configs.recommended,
  
});