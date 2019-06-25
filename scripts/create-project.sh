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


# Captures (most) of the steps necessary to create a project
# used for deploying the solutions. Primarily provided as documentation
# of the current project setup.

source "$(dirname $0)/utils.sh"

PROJECT_ID="$1"

if [ $# -eq 0 ]
  then
    echo "No arguments supplied. Must include a project ID to create"
fi

gcloud projects create "${PROJECT_ID}"
gcloud --project="${PROJECT_ID}" services enable \
    drive.googleapis.com

echo "Go to https://console.developers.google.com/apis/credentials?organizationId=0&project=${PROJECT_ID}"
echo "to create credentials."