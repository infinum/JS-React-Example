# Jest Configuration

This package provides a shared Jest configuration for the monorepo that can be extended by individual packages.

## Base Configuration

The base configuration (`index.js`) includes:

- **Test Environment**: `jsdom` for React component testing
- **TypeScript Support**: `ts-jest` preset with Jest-specific TypeScript configuration
- **Module Resolution**: Path mapping and CSS mock handling
- **Coverage Setup**: Default thresholds and reporters
- **File Extensions**: Support for `.ts`, `.tsx`, `.js`, `.jsx`, `.json`

## Usage

### Basic Extension

```javascript
// jest.config.js
const baseConfig = require('@infinum/configs/jest');

module.exports = {
  ...baseConfig,
  // Your custom configuration here
};
```

### Customizing Module Name Mapping

```javascript
const baseConfig = require('@infinum/configs/jest');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@your-package/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Overriding Coverage Thresholds

```javascript
const baseConfig = require('@infinum/configs/jest');

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
```

## Setup Files

Each package should have its own `jest.setup.ts` file for package-specific test setup:

```javascript
module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

## CSS Mocking

The base configuration automatically mocks CSS imports. Make sure to create a `src/__mocks__/styleMock.js` file in your package:

```javascript
// src/__mocks__/styleMock.js
module.exports = {};
```

## TypeScript Configuration

Each package must have a Jest-specific TypeScript configuration file (`tsconfig.jest.json`) that extends the main `tsconfig.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "types": ["jest", "@testing-library/jest-dom", "node"],
    "moduleResolution": "node"
  },
  "include": [
    "src/**/*",
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx",
    "src/**/__tests__/**/*",
    "jest.setup.ts"
  ],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

## Default Coverage Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Individual packages can override these as needed.
