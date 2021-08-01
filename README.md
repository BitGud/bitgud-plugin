# bitgud-plugin

## Install

WDCC x SESA Hackathon 2021 💻

Download Here: https://www.npmjs.com/package/bitgud-plugin

Fully opensource BitGud Husky Hook Plugin used to detect commits made by the users based on their settings in [BitGud](https://noisy-firefly-1302.on.fleek.co/#/)

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
npm set-script bitgud-plugin "bitgud-plugin"
npm run prepare
```

Add pre-commit hook to husky

```
npx husky add .husky/pre-commit "npm run bitgud-plugin"
```

## Settings

Settings are available on [BitGud](https://noisy-firefly-1302.on.fleek.co/#/)
