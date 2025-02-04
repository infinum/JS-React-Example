# React Example project test

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
npm ci

# Start the dev server
npm run dev
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

## Secrets

### Installation

You need to install `secrets_cli` gem. Explained [here](https://github.com/infinum/secrets_cli)

`gem install secrets_cli`

### Configuration

Create a new token on [GitHub](https://github.com/settings/tokens) with `read:org` permissions.

Add 3 new environment variables to `.zshrc` file:

```
export VAULT_ADDR=https://vault.byinfinum.co:8200
export VAULT_AUTH_METHOD=github
export VAULT_AUTH_TOKEN={your_github_token}
```

Don't forget to restart your `exec $SHELL`

> Check the [secrets_cli prerequisites](https://github.com/infinum/secrets_cli#prerequisites) section for more details.

### Pull the secrets

Pull the secrets for the specific environment. Explained [here](https://github.com/infinum/secrets_cli#usage)

`secrets pull -e development`

### Vault dashboard

Example link to Vault dashboard:

- [development](https://vault.byinfinum.co:8200/ui/vault/secrets/js/show/js-react-example/development)
- [staging](https://vault.byinfinum.co:8200/ui/vault/secrets/js/show/js-react-example/staging)

You should log in with the GitHub method and use VAULT_AUTH_TOKEN for the token.

## Styleguide

This project is using the styleguide as defined in the [Infinum Handbook](https://infinum.com/handbook/frontend/react/chakra-ui).

## Project Structure

- [Infinum Handbook - Project Structure](https://infinum.com/handbook/frontend/react/project-structure)

## Starting a new project from this template

If you need to start a new project from this template, you have these options:

1. Stripped down version of the App from `project-starter-template` branch

```bash
npx create-next-app@latest PROJECT_NAME -e https://github.com/infinum/JS-React-Example/tree/project-starter-template --use-npm
```

2. Full-blown example App from the `master` branch

```bash
npx create-next-app@latest PROJECT_NAME -e https://github.com/infinum/JS-React-Example --use-npm
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
