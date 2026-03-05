#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./view.sh <ppm-file>"
    echo "Example: ./view.sh 02-basic-raytracing/output.ppm"
    exit 1
fi

PPM_FILE="$1"
PNG_FILE="${PPM_FILE%.ppm}.png"

if [ ! -f "$PPM_FILE" ]; then
    echo "Error: File not found: $PPM_FILE"
    exit 1
fi

if command -v convert &> /dev/null; then
    convert "$PPM_FILE" "$PNG_FILE"
    echo "Converted to: $PNG_FILE"
    
    if command -v xdg-open &> /dev/null; then
        xdg-open "$PNG_FILE"
    elif command -v open &> /dev/null; then
        open "$PNG_FILE"
    else
        echo "Open $PNG_FILE with your preferred image viewer"
    fi
elif command -v eog &> /dev/null; then
    eog "$PPM_FILE"
elif command -v feh &> /dev/null; then
    feh "$PPM_FILE"
elif command -v display &> /dev/null; then
    display "$PPM_FILE"
else
    echo "No suitable image viewer found"
    echo "Install one of: imagemagick, eog, feh, or ImageMagick"
    echo "Or view the PPM file directly in GIMP"
fi
