/** @type {import('ts-jest').JestConfigWithTsJest} */
const { compilerOptions } = require('./tsconfig');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Используйте 'jsdom' для фронтенд-тестов
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Поддержка .ts и .tsx файлов
  },
  
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};