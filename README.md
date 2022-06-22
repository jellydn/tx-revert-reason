# Welcome to tx-revert-reason 👋

[![Version](https://img.shields.io/npm/v/tx-revert-reason.svg)](https://www.npmjs.com/package/tx-revert-reason)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> Decode revert reason from failed transaction

## 🏠 [Homepage](https://github.com/jellydn/tx-revert-reason)
### ✨ [API documentation](https://tx-revert-reason.productsway.com)

## Install

```sh
yarn add tx-revert-reason
```

## Usage

### CLI
```sh
cp .env.example .env # Fill the provider url
npx tx-revert-reason --help
```

### Typescript

```typescript
import { getReasonByWeb3Js, getReasonByEthersJs } from 'tx-revert-reason';

const reasonByWeb3 = await getReasonByWeb3Js(txHash, providerUrl);
const reasonByEthers = await getReasonByEthersJs(txHash, providerUrl);

```

## Develop

```sh
cp .env.example .env # Fill the provider url
yarn start TX_HASH # Check revert reason from tx hash
yarn start --help # Show help
```

## Stargazers

[![Stargazers repo roster for @jellydn/tx-revert-reason](https://reporoster.com/stars/jellydn/tx-revert-reason)](https://github.com/jellydn/tx-revert-reason/stargazers)

## Show your support

Give a ⭐️ if this project helped you!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q61Q7YM)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
