#!/bin/env bash


# Check if GitHub Pages is enabled
echo ">>> Checking if GitHub Pages is enabled for this repository..."

PAGES_ENABLED=false

for i in {1..36}; do
    echo "> Check attempt $i of 36..."

    PAGES_STATUS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/repos/${GITHUB_REPOSITORY}/pages)

    if ! echo "$PAGES_STATUS" | grep -q "message.*Not Found"; then
        echo ">> GitHub Pages is enabled! Continuing with workflow."

        PAGES_ENABLED=true
        echo "pages_enabled=true" >> $GITHUB_OUTPUT
        break
    else
        echo "> GitHub Pages is not yet enabled."
        echo "Please go to Settings > Pages and enable GitHub Pages (source: GitHub Actions)."
        echo "Waiting 5 seconds before checking again."

        # If this is the last attempt, stop waiting
        if [ $i -eq 36 ]; then
            echo ">> Maximum attempts reached. GitHub Pages is not enabled."
            echo "pages_enabled=false" >> $GITHUB_OUTPUT
            exit 1
        else
            sleep 5
        fi
    fi
done