#!/bin/env bash

echo ">>> Updating Compiler..."

source .github/scripts/utils.sh || exit 1

#---------------- config ----------------

COMPILER_DIR_NAME="$(get-conf '.compiler_dir_name')"
UPSTREAM_REPO_URL="$(get-conf '.upstream_repo_url')"

#--------------- Main ----------------

git clone --depth 1 "$UPSTREAM_REPO_URL" "$COMPILER_DIR_NAME" || {
    echo ">> Failed to clone Compiler repository. Please check your internet connection or repository URL.";
    exit 1
}

{
    replace-content "$COMPILER_DIR_NAME"/.github/config.json .github/config.json &&
    replace-content "$COMPILER_DIR_NAME"/.github/scripts .github/scripts &&
    rm -rf "$COMPILER_DIR_NAME"
} || {
    echo ">> Failed to update compiler.";
    exit 1
}


echo ">> Compiler updated successfully."