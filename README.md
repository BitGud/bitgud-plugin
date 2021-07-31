# bitgud-plugin

## Install

```
npm i --save-dev bitgud-plugin
```

## Pre-Commit Hook

```
npm i --save-dev husky
```

```
npm set-script prepare "husky install"
npm run prepare
```

```
"husky": {
  "hooks": {
    "pre-commit": "bitgud-plugin"
  }
}
```

Test
