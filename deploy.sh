#!/bin/bash

# Initialize target with currently deployed files
git clone --depth 1 --branch=master https://github.com/wololock/wololock.github.io.git .deploy_git

cd .deploy_git

# Remove all files before they get copied from ../public/
# so git can track files that were removed in the last commit
find . -path ./.git -prune -o -exec rm -rf {} \; 2> /dev/null

cd ../

# Run deployment
hexo clean
hexo deploy