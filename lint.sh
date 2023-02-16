#!/bin/bash

npx yamllint -- **/*.yml
npx markdownlint ./README.md --fix