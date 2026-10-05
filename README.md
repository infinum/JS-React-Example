# React Example project

## Technology

- [Next.js](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) (components in `src/components/ui`, add more with `pnpm exec shadcn add <component>`)
- [React Hook Form](https://react-hook-form.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Jest](https://jestjs.io/) for unit and integration tests, with [jest-axe](https://github.com/NickColley/jest-axe) for accessibility checks
- ESLint, Prettier, and a husky + lint-staged pre-commit hook

## Project setup

```bash
# Install dependencies
pnpm i

# create .env.local file from .env.example
cp .env.example .env.local
```

## Development

```bash
# Start the dev server
pnpm dev

# Checks
pnpm lint
pnpm typecheck
pnpm test
```

## Project Structure

- [Infinum Handbook - Project Structure](https://infinum.com/handbook/frontend/react/project-structure#app-router)

# Credits

JS-React-Example is maintained by
[Infinum](https://www.infinum.com).

<p align="center">
  <a href='https://infinum.com'>
    <picture>
        <source srcset="https://assets.infinum.com/brand/logo/static/white.svg" media="(prefers-color-scheme: dark)">
        <img src="https://assets.infinum.com/brand/logo/static/default.svg">
    </picture>
  </a>
</p>
