#!/bin/env bash

source .github/scripts/utils.sh

#--------------------- Config ---------------------

FORCE_DEPLOY="$_FORCE_DEPLOY"
GIT_EVENT_NAME="$_GITHUB_EVENT_NAME"
GITHUB_REF_NAME="$_GITHUB_REF_NAME"

COMPILER_DIR_NAME="$(get-conf '.compiler_dir_name')"

UPSTREAM_REPO_URL="$(get-conf '.upstream_repo_url')"
UPSTREAM_REPO_URL_RAW="$(get-conf '.upstream_repo_url_raw')"

LOCAL_VERSION="$(get-conf '.local_version')"
DUMMY_VERSION="$(get-conf '.dummy_version')"


DEBUG_MODE="$(get-conf '.debug_mode')"

#----------------- Get Local Version -----------------


echo "local_version=$LOCAL_VERSION" >> $GITHUB_OUTPUT
echo "dummy_version=$DUMMY_VERSION" >> $GITHUB_OUTPUT

if [ ! -d .github ]; then
    echo ">>> .github directory not found."
    exit 1
fi

if [ "$LOCAL_VERSION" == "null" ]; then
    echo ">>> Local version not set in config.json"
    exit 1
else
    echo ">>> Local version: $LOCAL_VERSION"
fi


#----------------- Get Upstream Version -----------------

if [ "$DUMMY_VERSION" == "null" ]; then
    echo "Dummy Version not Found in config.json"
    exit 1
fi

force_deploy=false


# Check for force_deploy workflow_dispatch
if [[ "$FORCE_DEPLOY" == "true" ]]; then

    [ "$DEBUG_MODE" == true ] && echo ">>> Force deployment requested!"

    force_deploy=true

    echo "upstream_updated=true" >> $GITHUB_OUTPUT
    echo "upstream_version=$DUMMY_VERSION" >> $GITHUB_OUTPUT
fi

# Check for push to content branch
if [[ "$GIT_EVENT_NAME" == "push" && "$GITHUB_REF_NAME" == "content" ]]; then

    [ "$DEBUG_MODE" = true ] && {
        echo "[debug]   git ref name: $GITHUB_REF_NAME";
        echo "[debug]   git Event name: $GITHUB_EVENT_NAME";
    }

    echo ">>> Content branch change detected - deploying regardless of upstream changes"
    force_deploy=true

    echo "upstream_updated=true" >> $GITHUB_OUTPUT
    echo "upstream_version=$DUMMY_VERSION" >> $GITHUB_OUTPUT
fi

# For cron job, check upstream for changes

echo ">>> Scheduled job - checking for upstream changes..."

# Fetch upstream version
echo "> Fetching package.json..."

max_attempts=5
attempt=1
success=false

while [ $attempt -le $max_attempts ] && [ "$success" = false ]; do
    echo "Attempt $attempt of $max_attempts"

    if curl -s -f "$UPSTREAM_REPO_URL_RAW/compiler/package.json" > /tmp/package.json; then

        if [ "$DEBUG_MODE" = true ]; then
            echo "[debug]   Fetched package.json from $UPSTREAM_REPO_URL_RAW/compiler/package.json"
        fi

        if latest_version=$(jq -r .version < /tmp/package.json); then
            echo "Latest upstream version: $latest_version"
            success=true
        else
            echo "Failed to extract version, retrying in 5 seconds..."
            sleep 5
            ((attempt++))
        fi
    else
        echo "Failed to fetch package.json, retrying in 5 seconds..."
        sleep 5
        ((attempt++))
    fi
done

if [ "$success" = false ]; then
    echo ">>> Failed to fetch upstream version after $max_attempts attempts."
    echo "Plsase check your upstream URL or internet connection."
    exit 1
fi


#------------------ Compare versions -------------------

if [ "$LOCAL_VERSION" != "$latest_version" ]; then
    echo ">>> Upstream version has changed!"

    echo "upstream_updated=true" >> $GITHUB_OUTPUT
    echo "upstream_version=$latest_version" >> $GITHUB_OUTPUT
else
    echo ">>> No upstream changes detected."

    if [ "$force_deploy" != true ]; then
        echo "upstream_updated=false" >> $GITHUB_OUTPUT
        echo "upstream_version=$latest_version" >> $GITHUB_OUTPUT
    fi
fi
