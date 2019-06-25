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

"""Utility app for importing documents from Office Open XML file formats.
"""

from __future__ import print_function
import sys
import os.path
import mimetypes
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google import auth

mimetypes.init()

GOOGLE_SHEETS = 'application/vnd.google-apps.spreadsheet'
GOOGLE_DOCS = 'application/vnd.google-apps.document'
GOOGLE_SLIDES = 'application/vnd.google-apps.presentation'

TYPE_MAP = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': GOOGLE_SHEETS,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': GOOGLE_DOCS,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': GOOGLE_SLIDES
}

def import_file(file_path, title, source_mime_type, dest_mime_type):
    """Imports a file with conversion to the native Google document format.
    Expects the env var GOOGLE_APPLICATION_CREDENTIALS to be set for
    credentials.

    Args:
        path (str): Path to file to import
        title(str): The title of the document to create
        source_mime_type(str): Original mime type of file
        dest_mime_type(str): Mime type to convert to

    Returns:
        str: The ID of the new file in drive
    """
    credentials, _ = auth.default()
    drive_service = build('drive', 'v3', credentials=credentials)

    file_metadata = {
        'name': title,
        'mimeType': dest_mime_type
    }
    media = MediaFileUpload(file_path, mimetype=source_mime_type)
    file = drive_service.files().create(body=file_metadata,
                                        media_body=media,
                                        fields='id').execute()
    return file.get('id')

def main(file_path, name=None):
    """ Main entry point for app.

    Args:
      file_path (str): Path to file to import
      name (str): Name of document.
    """
    if name is None:
        name = os.path.basename(file_path)
    mime_type = mimetypes.guess_type(file_path)
    convert_to = TYPE_MAP.get(mime_type)
    file_id = import_file(file_path, name, mime_type, convert_to)
    print(file_id)

if __name__ == "__main__":
    main(sys.argv[1], *sys.argv[2:])
