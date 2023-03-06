# Contributing Guide

Loving jsxdocgen and want to get involved? Thanks!

## Setup

```bash
# clone repo
git clone https://github.com/wjq990112/jsxdocgen

# install deps
pnpm install
```

## Start

```bash
pnpm dev
# or
pnpm start

# with specific package
pnpm --dir ./packages/parser start
# or
pnpm --filter ./packages/parser start
```

## Test

```bash
pnpm test

# with test coverage
pnpm test:cov

# with specific package
pnpm --dir ./packages/parser test
# or
pnpm --filter ./packages/parser test
```

## Build

```bash
pnpm build

# with specific package
pnpm --dir ./packages/parser build
# or
pnpm --filter ./packages/parser build
```
