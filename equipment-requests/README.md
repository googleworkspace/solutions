# Manage new employee equipment requests

This solution is a a simple form-based workflow to request equipment from IT
for new employees.

## Description

In this solution, HR submits a request, using Google Forms, for each new
employee requiring system access and equipment. They indicate which
devices the employee will need under various categories. They also include
start dates and office location.

Upon submitting a request, IT is automatically notified to review the request
in Google Sheets. They set up system access and prepare devices and equipment
for the employee’s first day. Upon completion of the task, they update the
status column in the sheet. With a custom Apps Script, an email
notification is sent to HR once the status is marked as complete.

## Set Up Instructions

<!-- [START setup] -->

1. Create a copy of the sample [Equopment request spreadsheet](https://docs.google.com/spreadsheets/d/1J7l9RwM0l3qshc2cTQsKaCo6oa-usL4I9EackyTzJgo/copy).
1. Click the menu item **Tools** > **Script editor** to edit the script.
1. In the script, change the value of `REQUEST_NOTIFICATION_EMAIL` to your email address.
1. Save the script.
1. Close the script editor.
1. Click on custom menu item **Equipment requests** > **Setup**.
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new **Form** menu. Click it and select **Go to live form**.
1. Fill out the form and submit your response.
1. Check your email for a notification about the equipment request.
1. Return to the sheet.
1. In the `Pending requests' tab, change the status of the request to `Completed'
1. Within 5 minutes, you will receive another email notifying you the request has been completed.

<!-- [END setup] -->

