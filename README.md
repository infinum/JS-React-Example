# React Example project

## Technology

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Datx](https://datx.dev/)
- [JSON:API](https://jsonapi.org/)
- [SWR](https://swr.vercel.app/)
- [Chakra UI](https://chakra-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Jest](https://jestjs.io/) for unit and integration tests
- [Storybook](https://storybook.js.org/)
- [I18Next](https://www.i18next.com/)
- [Plop](https://plopjs.com/)
- [Plop Next.js Generators](https://github.com/infinum/react-nuts-and-bolts/tree/main/packages/plop-next-ts-generators)

## Next.js plugins

- [next-i18next](https://github.com/i18next/next-i18next)
- [next-sitemap](https://github.com/iamvishnusankar/next-sitemap)

## Project setup

```bash
# Install dependencies
pnpm i

# Start the dev server
pnpm dev
```

Use one of the user credentials to log in to the application

```
# user1
    email: 'user1@example.com'
    password: 'pasword12345'

# user2
    email: 'user2@example.com'
    password: 'pasword12345'

# user3
    email: 'user3@example.com'
    password: 'pasword12345'
```

## API

Cekila = Cedevita + Tekila

Documentation

- https://cekila.infinum.co/api/v1/docs/index.html

Project repository

- https://github.com/infinum/rails-jsonapi-example-app

## Deployment

- [Infinum Handbook - Deployment](https://infinum.com/handbook/frontend/git/deployment)

## Git workflow

- [Infinum Handbook - Branching](https://infinum.com/handbook/frontend/git/branching)

## Styleguide

This project is using the styleguide as defined in the [Infinum Handbook](https://infinum.com/handbook/frontend/react/chakra-ui).

## Project Structure

- [Infinum Handbook - Project Structure](https://infinum.com/handbook/frontend/react/project-structure)

## Starting a new project from this template

If you need to start a new project from this template, you have these options:

1. Stripped down version of the App from `project-starter-template` branch

```bash
pnpx create-next-app@latest PROJECT_NAME -e https://github.com/infinum/JS-React-Example/tree/project-starter-template --use-pnpm
```

2. Full-blown example App from the `master` branch

```bash
pnpx create-next-app@latest PROJECT_NAME -e https://github.com/infinum/JS-React-Example --use-pnpm
```

> Note: replace PROJECT_NAME with the name of your project

Once you have created your new project, you can push it to an existing repository using the following commands:

```bash
git remote add origin git@github.com:infinum/REPOSITORY_NAME
git branch -M main
git push -u origin main
```

> Note: Replace REPOSITORY_NAME with the name of your repository. These commands will add the remote repository, rename the branch to main, and push your changes to the remote repository.

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
