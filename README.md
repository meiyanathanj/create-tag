# create-tag
test
A GitHub Action to tag a commit with a valid semantic version.

For example:

```yaml
name: Tag

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Release version (e.g. v0.1.0)'
        required: true
      message:
        description: 'Tag message'
        required: true

jobs:
  create-tag:
    runs-on: ubuntu-18.04

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Create Tag
        uses: meiyanathanj/create-tag@v1
        with:
          version: ${{ github.event.inputs.version }}
          message: ${{ github.event.inputs.message }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

```
Run => tsc src/main.ts 
then test using below cmd

node src/main.js
```