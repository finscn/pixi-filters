#!/bin/bash

if [[ "$1" == "debug" ]]; then
    cd tools/screenshots
    npm run build -- --debug
    cd ../..
else
    npm run build
    cp ./bundle/dist/pixi-filters.js ~/DEV/www/MyGameTemplate/client/lib/3rd
fi

exit 0
