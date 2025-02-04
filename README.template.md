# [TODO:PROJECT_NAME]

[TODO:PROJECT_DESCRIPTION]

- [Setup](#setup)
  - [Prerequisites / Dependencies](#prerequisites--dependencies)
  - [Installation](#installation)
  - [Post-install](#post-install)
- [Usage](#usage)
  - [Running the app](#running-the-app)
  - [Building the app](#building-the-app)
- [Testing](#testing)
  - [Unit testing](#unit-testing)
  - [End to end tests](#end-to-end-tests)
  - [Code quality](#code-quality)
- [Environments](#environments)
- [Environment variables \[TODO: Remove non-applicable\]](#environment-variables-todo-remove-non-applicable)
  - [React](#react)
  - [Angular](#angular)
  - [List of environment variables](#list-of-environment-variables)
- [Deployment](#deployment)
- [Releases](#releases)
- [Translations](#translations)

## Setup

### Prerequisites / Dependencies

You will need to have NodeJS and pNPM installed to run this application. Use the Infinum handbooks to set up the [package manager](https://infinum.com/handbook/frontend/node/package-managers-guidelines) and [NodeJS version](https://infinum.com/handbook/frontend/node/managing-node-npm-versions).

### Installation

1. clone this repository: `git clone [TODO:GIT_LINK]`
2. install all the dependencies: `pnpm i`

### Post-install

1. set up the [environment variables](#environment-variables)

## Usage

### Running the app

To run the app, you can simply run `[TODO:NPM_START_COMMAND]`. This starts the application in the environment dependent on your environment setup.

### Building the app

To build the app you can use some of the following commands:

```
npm run build

# TODO: development and production builds if applicable
# pnpm build:dev
# pnpm build:prod

```

## Testing

### Unit testing

To start the unit tests you can use one of the following commands:

```
pnpm test
pnpm test:watch
pnpm test:coverage

```

### End to end tests

[TODO:DESCRIBE_E2E]

### Code quality

The following tools are used in the project to ensure code quality:

Prettier: for consistent code formatting.
ESLint: for identifying and fixing code quality issues.
Husky: Git hooks to automate code quality checks with ESLint and Prettier

Local code quality checks (Prettier, ESLint) are run before a user can commit their code through Husky's _pre-commit_ hook, which ensures that the code pushed to Git is consistent and doesn't include any obvious issues that can be detected with static analysis.

## Environments

There are currently two application environments:

1. DEV - development instance, used for testing developed features
   - API: [TODO:DEV_BACKEND_API_URL]
   - Frontend: [TODO:DEV_APP_URL]
2. PRODUCTION - production environment
   - API: [TODO:PROD_BACKEND_API_URL]
   - Frontend: [TODO:PROD_APP_URL]

## Environment variables [TODO: Remove non-applicable]

### React

You can specify your environment variables in the `.env` file based on `.env.example`.

### Angular

You can specify environment variables as per the guide in the [Nuts & Bolts](https://infinum.github.io/ngx-nuts-and-bolts/docs/environment-variables).

### List of environment variables

| Variable | Requirement | Description                                |
| -------- | ----------- | ------------------------------------------ |
| API_HOST | required    | API endpoint URL                           |
| ENV      | required    | Available options: development, production |

## Deployment

The application deployment is managed with GitHub Actions.

More information on the deployment process can be found in [Deployment process wiki page](TODO:GITHUB_WIKI_PAGE).

## Releases

Releases are handled through GitHub Releases feature and documentation for it can be found on [Release process wiki page](TODO:GITHUB_WIKI_PAGE).

## Translations

The application uses [Polyglot](TODO:PROJECT_POLYGLOT_LINK) for handling translations. More information can be found on the [Translations handling wiki page](TODO:GITHUB_WIKI_PAGE).
