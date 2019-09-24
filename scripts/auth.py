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

"""Utility app for creating a user credentials file compatible with
application default credentials.

Usage:
    python auth.py <path_to_client_secrets.json>
"""

from __future__ import print_function
import json
import sys
from google_auth_oauthlib.flow import InstalledAppFlow


SCOPES = [
    'https://www.googleapis.com/auth/drive.file'
]

def authorize(credentials_file_path, out_file_path='default_credentials.json'):
    """ Authorizes and generates a credential file usable with application
    default credentials.
    """
    flow = InstalledAppFlow.from_client_secrets_file(credentials_file_path, SCOPES)
    creds = flow.run_local_server()
    data = {
        'client_id': flow.client_config['client_id'],
        'client_secret': flow.client_config['client_secret'],
        'refresh_token': creds.refresh_token,
        'type': "authorized_user"
    }
    with open(out_file_path, 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':
    authorize(sys.argv[1])
