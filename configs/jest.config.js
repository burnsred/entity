import path from 'path';
import { fileURLToPath } from 'url';

// ES does not provide __dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.join(__dirname, './jest-file.mock.js'),
    '\\.(css|less)$': path.join(__dirname, './jest-style.mock.js'),
  },

  rootDir: process.cwd(),

  setupFiles: [
    'jest-prop-type-error',
  ],

  collectCoverageFrom: [
    'packages/*/src/**',
  ],
  coverageDirectory: 'reports/coverage',
  // coverageThreshold: { ?? },

};
