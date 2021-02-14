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

source "$(dirname $0)/../scripts/utils.sh"

DOC_TITLE="Agenda maker"
SRC_DIR="src"

cd $PROJECT_DIR

if ! [ -f .clasp.json ]; then
    create_standalone_script "${SRC_DIR}" "${DOC_TITLE}"
else
    update_script
fi
