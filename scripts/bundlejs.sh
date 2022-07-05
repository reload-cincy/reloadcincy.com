#!/bin/bash
# reload-cincy/scripts/bundlejs.sh
# Created by Alexander Burdiss 6/10/22
# Copyright (c) Alexander Burdiss
#
# A very simple command that bundles all the JavaScript files into one
# concatenated file.
#
# To ignore files from the bundle, include the flag `// bundle-ignore` in the
# first line of the file.
#
version="1.2.1"
projectName="reload-cincy"

# Get the current path and ensure that the script is ran from the right place.
dirname=$(pwd)
# enable +(...) glob syntax
shopt -s extglob
# trim however many trailing slashes exist
currentPath=${dirname%%+(/)}
# remove everything before the last / that still remains
currentPath=${currentPath##*/}
# correct for dirname=/ case
currentPath=${currentPath:-/}
if [ "$currentPath" != "$projectName" ]; then
    echo
    echo "Error: Script not ran from correct directory. Please run from the root directory using \`./scripts/bundlejs.sh\`"
    echo
    exit 1
fi

# Get all JS files in project
filenames=()
while IFS=  read -r -d $'\0'; do
    filenames+=("$REPLY")
done < <(find . -name '*.js' -print0)

bundlefile=bundle.js

# Create or overwrite an existing JS bundle
touch $bundlefile
now=$(date)
echo "// bundle.js created by bundlejs.sh v$version $now" > $bundlefile

# Bundle the JS files together!
for i in "${filenames[@]}"; do
    firstLine=$(head -n 1 $i)
    # Do not include bundle.js in the bundle, or intentionally ignored files
    if [ "$i" != "./$bundlefile" ] && [ "$firstLine" != "// bundle-ignore" ]; then
        # Comment the filename to show in the bundled output
        echo "// $i" >> $bundlefile
        funcName=$(echo $i | sed 's/[^a-zA-Z0-9]//g')
        echo "(function $funcName() {" | tr -d '\n' >> $bundlefile
        # Append the file's contents to the bundle
        # TODO: Fix this so that correctly pulls out comments (need to strip // to EOL)
        #      | Remove // lines| mult. spaces one| remove \n
        # cat $i | sed '/^\/\//d' | sed 's/  */ /g' | tr -d '\n' >> $bundlefile
        cat $i >> $bundlefile
        echo "})();" >> $bundlefile
    fi
done

echo "JavaScript bundled"
