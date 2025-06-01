echo -e ">>> Upstream has new update\n"


# Clone the Upstream Repo & switch to the code branch
echo -e ">>> Cloning upstream repository..."
git clone https://github.com/soymadip/portosaurus upstream
cd upstream
git switch code 
cd ..



# Add & replace content from current dir to upstream

echo -e "\n>>> Replacing content to upstream...\n"

ROOT_DIR="$(pwd)"
UPSTREAM_DIR="${ROOT_DIR}/upstream"

# Replace directory content
replace_dir() {
    local src_dir="$1"
    local dest_dir="$2"
    
    if [ -d "$src_dir" ]; then
        echo "Checking files in: $dest_dir"
        mkdir -p "$dest_dir"

        # Find and copy all files from source to destination
        find "$src_dir" -type f | while read src_file; do

            # Get the relative path from the source directory
            rel_path="${src_file#$src_dir/}"
            dest_file="$dest_dir/$rel_path"

            dest_file_dir=$(dirname "$dest_file")

            if [ ! -d "$dest_file_dir" ]; then
                mkdir -p "$dest_file_dir"
            fi

            # Copy files
            if [ -f "$dest_file" ]; then
                cp "$src_file" "$dest_file"
                echo "   ✅ Replaced:  $(basename $dest_file)"
            else
                cp "$src_file" "$dest_file"
                echo "   ✅ Added new: $(basename $dest_file)"
            fi
        done
    else
        echo "❌ Not Found: $src_dir"
    fi
}

# replace files
replace_file() {
    local src_file="$1"
    local dest_file="$2"

    if [ -f "$src_file" ]; then
        mkdir -p "$(dirname "$dest_file")"

        if [ -f "$dest_file" ]; then
            cp "$src_file" "$dest_file"
            echo "   ✅ Replaced:  $(basename $dest_file)"
        else
            cp "$src_file" "$dest_file"
            echo "   ✅ Added new: $(basename $dest_file)"
        fi
    else
        echo "❌ Not Found: $src_file"
    fi
}


replace_dir "${ROOT_DIR}/blog" "${UPSTREAM_DIR}/blog"
replace_dir "${ROOT_DIR}/notes" "${UPSTREAM_DIR}/notes"
replace_file "${ROOT_DIR}/config.js" "${UPSTREAM_DIR}/config.js"

echo -e "\n>>> Content replacement completed\n"



echo -e "\n>>> Compiling Source code..\n"

cd $UPSTREAM_DIR

npm ci 
rm -rf build



if npm run build; then
    cd ..
    echo -e "\n>>> Compilation successful!\n"
else
    echo "❌ Compilation failed. Please check the errors above."
    exit 1
fi