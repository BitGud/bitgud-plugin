# bitgud-plugin

## Install

```
npm i --save-dev bitgud-plugin
```

## Pre-Commit Hook

Install husky

```
npm i --save-dev husky
```

Prepare husky

```
npm set-script prepare "husky install"
npm run prepare
```

Add pre-commit hook to husky

```
npx husky add .husky/pre-commit "npm run bitgud-plugin"
```
