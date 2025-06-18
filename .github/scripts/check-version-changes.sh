#!/bin/bash

#---------------- config ------------------

has_update="$_HAS_UPDATE"

latest_version="$_LATEST_VERSION"
local_version="$_LOCAL_VERSION"
dummy_version="$_DUMMY_VERSION"

#--------------------------------------------


if [ "$has_update" == "true" ] && [ "$latest_version" != "$dummy_version" ]; then
    echo "> Local version: $local_version"
    echo ">>> Updating local version to $latest_version"

    set-conf '.local_version' "$latest_version"
    echo "changed=true" >> $GITHUB_OUTPUT
else
    echo "> Local version: $local_version"
    echo ">>> No version change detected. Skipping update."
    echo "changed=false" >> $GITHUB_OUTPUT
fi