get-conf() {
    local conf_file=".github/config.json"
    local key="$1"

    if [[ ! -f "$conf_file" ]]; then
        echo "❌ Config file not found: $conf_file" >&2
        return 1
    fi

    local value
    value=$(jq -er "$key" "$conf_file" 2>/dev/null)

    if [[ "$value" == "null" || -z "$value" ]]; then
        echo "❌ Key $key is missing or null in $conf_file" >&2
        exit 1
    fi

    echo "$value"
}


set-conf() {
    local conf_file=".github/config.json"
    local key="$1"
    local value="$2"

    if [[ ! -f "$conf_file" ]]; then
        echo "❌ Config file not found: $conf_file" >&2
        return 1
    fi

    if [[ -z "$key" || -z "$value" ]]; then
        echo "❌ Usage: set-conf <key> <value>" >&2
        return 1
    fi

    # Convert key to valid jq format if dot-separated
    local jq_key
    jq_key=$(jq -nr --arg k "$key" '$k' | sed 's/\./"."/g; s/^/."/; s/$/"/')

    # Update JSON file
    tmp_file=$(mktemp)

    if ! jq "$key |= \$newval" --argjson newval "\"$value\"" "$conf_file" > "$tmp_file" 2>/dev/null; then
        echo "❌ Failed to update key '$key' in $conf_file" >&2
        rm -f "$tmp_file"
        return 1
    fi

    mv "$tmp_file" "$conf_file"

    echo "✅ Updated $key to \"$value\" in $conf_file"
}



replace-site-conf() {
    case "$1" in
        -f|--force)
            local force_replace=true
            shift
        ;;
        *)
            local force_replace=false
        ;;
    esac

    local field_path="$1"
    local new_value="$2"
    local config_path="${3:-.github/config.js}"

    if [[ -z "$field_path" || -z "$new_value" ]]; then
        echo "❌ Usage: replace-site-conf [-f|--force] <field.path> <new_value> [config_path]"
        return 1
    fi

    if [[ ! -f "$config_path" ]]; then
        echo "❌ Config file not found: $config_path"
        return 1
    fi

    node <<EOF
const fs = require("fs");
const path = "$config_path";
const fieldPath = "$field_path";
const force = $force_replace;

let value = "$new_value";

try {
  value = JSON.parse(value);
} catch (_) {
  // fallback to string
}

let raw;

try {
  raw = fs.readFileSync(path, "utf-8");
} catch {
  console.error("❌ Failed to read file: " + path);
  process.exit(1);
}

const exports = {};

try {
  eval(raw); // defines exports.usrConf
} catch (err) {
  console.error("❌ Failed to parse config.js: " + err.message);
  process.exit(1);
}

let obj = exports.usrConf;

if (!obj) {
  console.error("❌ Missing exports.usrConf in config.");
  process.exit(1);
}

// Resolves deep path and returns parent + key
function resolvePath(root, path) {
  const parts = path.match(/[^.\[\]]+/g);
  if (!parts) return null;

  const last = parts.pop();
  let parent = root;

  for (const part of parts) {
    if (!(part in parent)) {
      console.error("❌ Missing path segment: " + part);
      process.exit(1);
    }
    parent = parent[part];
  }

  return { parent, key: last };
}

const { parent, key } = resolvePath(obj, fieldPath);

if (!(key in parent)) {
  console.error("❌ Field not found: " + key);
  process.exit(1);
}

if (parent[key] === "auto" || force) {
  parent[key] = value;

  const output = "exports.usrConf = " + JSON.stringify(exports.usrConf, null, 2) + ";\n";
  fs.writeFileSync(path, output);
  console.log("✅ Updated: $field_path →", JSON.stringify(value));
} else {
  console.log("⏭️  Skipped: $field_path ≠ auto (use -f to force)");
}
EOF
}


# Replace a directory or file with the contents of another directory or file.
replace-content() {
    local src="$1"
    local dest="$2"

    # Check if file
    if [ -f "$src" ]; then
        mkdir -p "$(dirname "$dest")"
        rsync -a --checksum "$src" "$dest" && \
            echo "   ✅ Replaced:     $(basename "$dest")" || \
            echo "   ❌ Failed:       $(basename "$dest")"

    # Check if directory
    elif [ -d "$src" ]; then
        echo -e "\n⏭️ Checking files in: $dest"
        mkdir -p "$dest"

        find "$src" -type f | while read -r src_file; do
            # Skip .placeholder files
            if [[ "$(basename "$src_file")" == ".placeholder" ]]; then
                echo "   ⏭️ Skipping:      .placeholder file"
                continue
            fi

            local rel_path="${src_file#$src/}"
            local dest_file="$dest/$rel_path"

            mkdir -p "$(dirname "$dest_file")"
            rsync -a --checksum "$src_file" "$dest_file" && \
                echo "   ✅ Replaced:     $(basename "$dest_file")" || \
                echo "   ❌ Failed:       $(basename "$dest_file")"
        done
    else
        echo "❌ Not Found: $src"
    fi
}


# switch to COMPILER dir, branch, pull changes
switch-compiler-branch() {
    local current_dir="$(pwd)"
    local branch_name="$1"

    if [ -d "$COMPILER_DIR" ]; then
        cd "$COMPILER_DIR" || exit 1
        git switch "$branch_name" > /dev/null 2>&1 || {
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
