source .github/scripts/utils.sh

upstream_dir="$2"

# Replace deployment artifact
if [ ! -d "$upstream_dir" ]; then
    echo "❌ Upstream dir not found not found."
    exit 1
fi

replace-content "${upstream_dir}"/scripts     .github/scripts
replace-content "${upstream_dir}"/config.json .github/config.json

rm -rf "$upstream_dir"

# check for file changes
if git diff --quiet .github; then
    echo "> No changes in upstream files."
    echo "changed=false" >> $GITHUB_OUTPUT
else
    echo "> Changes detected in upstream files."
    echo "changed=true" >> $GITHUB_OUTPUT
fi
