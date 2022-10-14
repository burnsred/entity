# Getting started

Each separate workspace in `packages/` produces raw ESM code.
There is no bundling done, as it is left as an exercise to the consumer.


## Consumer project requirements

As part of the codebase currently uses the non-standard import syntax:

```
export default from './Foo';
```

You will need babel and the `@babel/plugin-proposal-export-default-from` plugin.

This can be added to your `plugins` list with no additional configurations.

## Project setup

Make sure to use node v16.16 and npm v8 or above

Install project dependencies:

```
npm install
```

#### Run linters

This will run both CSS and JS linters:
```
npm run lint
```

Each can be run independently:

```
npm run lint:js
npm run lint:css
```


#### Run tests

```
npm test
```
