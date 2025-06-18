#!/bin/env bash

if [ "$_REPO_OWNER" == 'soymadip' ]; then
    git config user.name 'soymadip'
    git config user.email "${_GITHUB_ACTOR}@users.noreply.github.com"
else
    git config user.name  'GitHub Actions'
    git config user.email 'actions@github.com'
fi

git add .github/scripts .github/config.json

# push changes
git commit -m "SYNC with upstream"

if git push origin ${GITHUB_REF_NAME}; then
    echo ">>> Changes pushed successfully"
else
    echo ">> Failed to push changes"
    exit 1
fi
