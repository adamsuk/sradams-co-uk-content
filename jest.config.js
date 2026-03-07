const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Map ESM-only packages to CJS mocks so Jest can load them
    '^rehype-raw$': '<rootDir>/__mocks__/pluginMock.js',
    '^rehype-sanitize$': '<rootDir>/__mocks__/pluginMock.js',
    '^remark-gfm$': '<rootDir>/__mocks__/pluginMock.js',
  },
  collectCoverageFrom: [
    'pages/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'default-env.ts',
    '!pages/_app.tsx',
    '!pages/_document.tsx',
    // MediaPlayer is commented out and not integrated into the app
    '!components/sandbox/MediaPlayer.tsx',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'json-summary'],
};

module.exports = createJestConfig(customJestConfig);
