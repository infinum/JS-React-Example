# Code generators

We use [hygen](https://www.hygen.io/) for bootstrapping components.

## How to install:

On macOS and Homebrew:

```
$ brew tap jondot/tap
$ brew install hygen
```

Globally with npm (or yarn):

```
$ npm i -g hygen
```

Or, if you like a no-strings-attached approach, use with npx

```
$ npx hygen ...
```

## Generate Components:

```
hygen component atom Card
```

It will create component structure like this:

```
components/
  └── ui/
      └── atoms/
            └── Card/
                ├── Card.tsx
                ├── Card.story.tsx
                └── Card.test.tsx
```

Form more details run:

```
hygen component help
```
