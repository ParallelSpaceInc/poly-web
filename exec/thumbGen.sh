#!/bin/bash
if [ "$#" = 1 ]
then
        blender -b -P exec/picGen.py -- "$1"
else
        echo Usage : thumbGen.sh [filename]
fi