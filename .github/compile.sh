# Replace a single file
replace_file() {
    local src_file="$1"
    local dest_file="$2"

    if [ -f "$src_file" ]; then
        mkdir -p "$(dirname "$dest_file")"

        if [ -f "$dest_file" ]; then
            cp "$src_file" "$dest_file"
            echo "   ✅ Replaced:  $(basename "$dest_file")"
        else
            cp "$src_file" "$dest_file"
            echo "   ✅ Added new: $(basename "$dest_file")"
        fi
    else
        echo "❌ Not Found: $src_file"
    fi
}


# Replace directory content
replace_dir() {
    local src_dir="$1"
    local dest_dir="$2"

    if [ -d "$src_dir" ]; then
        echo "Checking files in: $dest_dir"
        mkdir -p "$dest_dir"

        # Find and copy all files from source to destination
        find "$src_dir" -type f | while read -r src_file; do

            # Skip .placeholder files
            if [[ "$(basename "$src_file")" == ".placeholder" ]]; then
                echo "   ⏭️ Skipping: .placeholder file"
                continue
            fi

            # Get the relative path from the source directory
            local rel_path="${src_file#$src_dir/}"
            local dest_file="$dest_dir/$rel_path"

            replace_file "$src_file" "$dest_file"
        done
    else
        echo "❌ Not Found: $src_dir"
    fi
}


# switch to COMPILER dir, branch, pull changes
switch_compiler_branch() {
    local current_dir="$(pwd)"
    local branch_name="$1"

    if [ -d "$COMPILER_DIR" ]; then
        cd "$COMPILER_DIR" || exit 1
        git switch "$branch_name" || {
            echo "❌ Failed to switch to branch '$branch_name'."
            exit 1
        }
        git pull || {
            echo "❌ Failed to pull changes from branch '$branch_name'."
            exit 1
        }
        cd "$current_dir" || exit 1
    else
        echo "❌ COMPILER directory not found. Please clone the repository first."
        exit 1
    fi
}


# ------------------- Configuration ------------------

COMPILER_DIR_NAME="COMPILER"    # compiler dir name
OUTPUT_DIR_NAME="build"         # output directory name


# -------------------- Main Logic ------------------

ROOT_DIR="$(pwd)"

COMPILER_DIR="${ROOT_DIR}/${COMPILER_DIR_NAME}"
OUTPUT_DIR="${ROOT_DIR}/${OUTPUT_DIR_NAME}"


if [ ! -d "$COMPILER_DIR" ]; then
    echo -e ">>> Cloning upstream repository..."
    git clone https://github.com/soymadip/portosaurus "$COMPILER_DIR"
fi


# Add or replace files to the compiler
echo -e "\n>>> Adding or replacing files in the compiler...\n"

switch_compiler_branch "compiler"

replace_dir "${ROOT_DIR}/src" "${COMPILER_DIR}/static"
replace_dir "${ROOT_DIR}/blog" "${COMPILER_DIR}/blog"
replace_dir "${ROOT_DIR}/notes" "${COMPILER_DIR}/notes"
replace_file "${ROOT_DIR}/config.js" "${COMPILER_DIR}/config.js"

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

cp -r "${COMPILER_DIR}/build" "${OUTPUT_DIR}" || {
    echo "❌ Failed to copy compiled files. Please check the logs above."
    exit 1
}


# Cleanup
echo -e ">>> Cleaning Up....\n"
rm -rf "${COMPILER_DIR}"
echo -e ">>> Cleanup completed.\n"