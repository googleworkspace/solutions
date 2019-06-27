#!/usr/bin/env bash

# Copyright 2019 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Shared functions for deploying solutions

# Get the absolute path to a file
# Arguments:
#   $1 - relative path to convert
# Returns:
#   Absolute path of file
function abspath() {
    if [ -d "$1" ]; then
        # dir
        (cd "$1"; pwd)
    elif [ -f "$1" ]; then
        # file
        if [[ $1 = /* ]]; then
            echo "$1"
        elif [[ $1 == */* ]]; then
            echo "$(cd "${1%/*}"; pwd)/${1##*/}"
        else
            echo "$(pwd)/$1"
        fi
    fi
}


PROJECT_DIR=$(dirname $(abspath $0))
UTIL_DIR=$(dirname $(abspath $BASH_SOURCE))
ROOT_DIR=$(dirname $UTIL_DIR)

if ! [ -x "$(command -v gcloud)" ]; then
    echo 'Error: gcloud is not installed.' >&2
    exit 1
fi

if ! [ -x "$(command -v python3)" ]; then
    echo 'Error: Python not available.' >&2
    exit 1
fi

if ! [ -x "$(command -v npx)" ]; then
    echo 'Error: npx not available.' >&2
    exit 1
fi

if [ -z "${GOOGLE_APPLICATION_CREDENTIALS}" ]; then
    GOOGLE_APPLICATION_CREDENTIALS="${ROOT_DIR}/default_credentials.json"
fi

if ! [ -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]; then
    echo "Error: GOOGLE_APPLICATION_CREDENTIALS not set correctly."
    echo "File not found: ${GOOGLE_APPLICATION_CREDENTIALS}"
    exit 1
fi

# Imports and converts a document
# Arguments:
#   $1 - path to file
#   $2 - title of document
# Returns:
#   ID of file
function import_document() {
    cd $PROJECT_DIR
    local result=$(python "${UTIL_DIR}/import_document.py" "$1" "$2")
    if [ $? -ne 0 ]; then
        echo 'Unable to import file'
        echo "${result}"
        exit 1
    fi
    echo "${result}"
}

# Internal helper for creating and pushing a script
# Globals
#   PROJECT_DIR - Path to project directory
# Arguments:
#   $@ - clasp args - source directory, relative to PROJECT_DIR
# Returns:
#   None
function _create_script() {
    cd $PROJECT_DIR
    npx @google/clasp create  "$@"
    # TODO: Remove next line pending clasp fix for overwritting files when src dir used
    git checkout -- src/appsscript.json 
    npx @google/clasp push -f
}

# Creates and pushes a container bound script
# Globals
#   PROJECT_DIR - Path to project directory
# Arguments:
#   $1 - source directory, relative to PROJECT_DIR
#   $2 - Title of script project
#   $3 - ID of the container
# Returns:
#   None
function create_bound_script() {
    _create_script --rootDir "$1" --title "$2" --parentId "$3"
}

# Creates and pushes a standalone script
# Globals
#   PROJECT_DIR - Path to project directory
# Arguments:
#   $1 - source directory, relative to PROJECT_DIR
#   $2 - Title of script project
# Returns:
#   None
function create_standalone_script() {
    _create_script --type standalone --rootDir "$1" --title "$2"
}

# Pushes a clasp managed project
# Globals
#   PROJECT_DIR - Path to project directory
# Arguments:
#   None
# Returns:
#   None
function update_script() {
    cd $PROJECT_DIR
    npx @google/clasp push -f
}
