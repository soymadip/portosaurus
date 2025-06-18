#!/bin/env bash

source .github/scripts/utils.sh

# ------------------- Configuration ------------------

COMPILER_DIR_NAME="$(get-conf '.compiler_dir_name')"       # Compiler directory name
COMPILER_REPO_URL="$(get-conf '.upstream_repo_url')"       # Upstream repository URL

OUTPUT_DIR_NAME="$(get-conf '.compiler_output_dir_name')"  # output directory name

# -------------------- Main Logic ------------------

ROOT_DIR="$(pwd)"

COMPILER_DIR="${ROOT_DIR}/${COMPILER_DIR_NAME}"
OUTPUT_DIR="${ROOT_DIR}/${OUTPUT_DIR_NAME}"


if [ ! -d "$COMPILER_DIR" ]; then
    echo -e ">>> Cloning upstream repository...\n"

    git clone "$COMPILER_REPO_URL" "$COMPILER_DIR" || {
        echo -e "\n> Failed to clone portusaurus repo."
        exit 1
    }
fi


# Add or replace files to the compiler
echo -e "\n>>> Adding or replacing files in the compiler...\n"

switch-compiler-branch "compiler"

replace-content "${ROOT_DIR}/src" "${COMPILER_DIR}/static"
replace-content "${ROOT_DIR}/blog" "${COMPILER_DIR}/blog"
replace-content "${ROOT_DIR}/notes" "${COMPILER_DIR}/notes"
replace-content "${ROOT_DIR}/config.js" "${COMPILER_DIR}/config.js"

if [[ "$GITHUB_ACTIONS" == "true" ]]; then

    THIS_REPO_NAME="$_REPO_NAME"
    THIS_REPO_OWNER="$_REPO_OWNER"

    SITE_URL="https://${THIS_REPO_OWNER}.github.io"

    if [ "$THIS_REPO_NAME" == "${THIS_REPO_OWNER}.github.io" ]; then
        SITE_PATH="/"
    else
        SITE_PATH="/${THIS_REPO_NAME}"
    fi

    replace-site-conf "site_url" "$SITE_URL" "${COMPILER_DIR}/config.js"
    replace-site-conf "site_path" "$SITE_PATH" "${COMPILER_DIR}/config.js"
else
    config_file_path="${COMPILER_DIR}/config.js"
    site_url_value="$(grep -E '^\s*site_url:' "$config_file_path" | sed -E 's/^\s*site_url:\s*"?([^",]+)"?,?$/\1/')"
    site_path_value="$(grep -E '^\s*site_path:' "$config_file_path" | sed -E 's/^\s*site_path:\s*"?([^",]+)"?,?$/\1/')"

    if [[ "$site_url_value" == "auto" || "$site_path_value" == "auto" ]]; then
        echo -e "\n>>> site_url and site_path are set to 'auto'."
        echo -e ">>> Please set them manually in config.js.\n"
        exit 1
    fi

fi

echo -e "\n>>> Content replacement Completed."


# Compile content
echo -e "\n>>> Compiling Portosaurus site...\n"

cd "$COMPILER_DIR" || {
    echo "❌ Failed to change directory to $COMPILER_DIR"
    exit 1
}

npm install || {
    echo "❌ Deps installation failed. Please check the logs above."
    exit 1
}

npm run build || {
    echo "❌ Compilation failed. Please check the logs above."
    exit 1
}

echo -e "\n>>> Compilation successful!\n"


# Copy compiled files to the output directory
echo -e ">>> Copying compiled files to $OUTPUT_DIR_NAME directory...\n"

if ! replace-content "${COMPILER_DIR}/build" "${OUTPUT_DIR}"; then
    echo "❌ Failed to copy compiled files. Please check the logs above."
    exit 1
fi


# Cleanup
echo -e "\n>>> Cleaning Up...."
rm -rf "${COMPILER_DIR}"
echo -e ">>> Cleanup completed.\n"
