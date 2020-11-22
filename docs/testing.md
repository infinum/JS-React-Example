# Testing

## Libraries

- [jest](https://jestjs.io/docs/en/getting-started)
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/)
- [@testing-library/react-hooks](https://react-hooks-testing-library.com/)
- [@testing-library/user-event](https://testing-library.com/docs/ecosystem-user-event/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [jest-svg-transformer](https://www.npmjs.com/package/jest-svg-transformer)
- [jest-emotion](https://emotion.sh/docs/jest-emotion)
- [identity-obj-proxy](https://jestjs.io/docs/en/webpack#mocking-css-modules)

## Test utils

`@test-utils` module is a set of test utils specific to this project.
It re-exports everything from `@testing-library/react` and overrides `render` function with custom function with predefined wrapper.
Wrapper is named `AllProviders` and it bootstraps `context` providers specific to this project, like `SWRConfig` and `ThemeProvider`.

```
import { render, fireEvent, waitFor, screen  } from '@test-utils';
```

## Test coverage

Run this command to generate test coverage.

```
npm run test:coverage
```
