---
title: Manage new employee equipment requests
description: Create a form-based workflow to request equipment from IT for new employees.
labels: Apps Script, Sheets, Forms
material_icon: computer
create_time: 2019-07-15
update_time: 2019-07-23
---

In this solution, HR submits a request, using Google Forms, for each new
employee requiring system access and equipment. They indicate which
devices the employee will need under various categories. They also include
start dates and office location.

Upon submitting a request, IT is automatically notified to review the request
in Google Sheets. They set up system access and prepare devices and equipment
for the employee’s first day. Upon completion of the task, they update the
status column in the sheet. With a custom Apps Script, an email
notification is sent to HR once the status is marked as complete.

![demo][screenshot]

## Technology highlights

- The [`FormApp` service][formapp-docs] is used to create a request form.
- The [`SpreadsheetApp` service][spreadsheetapp-docs] is used to move items in the spreadsheet through
  the workflow.
- [Triggers][triggers-docs] are used to monitor for new requests and clean up completed items.
- The [`MailApp` service][mailapp-docs] is used to send email notifications.

## Try it

[![Learn more about this solution](https://img.youtube.com/vi/-R_MK1HFlZE/0.jpg)](https://www.youtube.com/watch?v=-R_MK1HFlZE&list=PLU8ezI8GYqs4YntFNP9jf_rrZ0vJLSW2X&index=7)

1. Create a copy of the sample [Equipment request spreadsheet][sheet].
1. Click **Extensions** <span aria-label="and then">></span> **Apps Script** to edit the script.
1. In the script, change the value of `REQUEST_NOTIFICATION_EMAIL` to your email address.
1. Save the script.
1. Close the script editor.
1. Click on custom menu item **Equipment requests** > **Setup**.
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new **Form** menu. Click it and select **Go to live form**.
1. Fill out the form and submit your response.
1. Check your email for a notification about the equipment request.
1. Return to the sheet.
1. In the `Pending requests` tab, change the status of the request to `Completed`
1. Within 5 minutes, you will receive another email notifying you the request has been completed.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[screenshot]: https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/equipment-requests/screenshot.png
[sheet]: https://docs.google.com/spreadsheets/d/1J7l9RwM0l3qshc2cTQsKaCo6oa-usL4I9EackyTzJgo/copy
[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/equipment-requests
[formapp-docs]: https://developers.google.com/apps-script/reference/forms/form-app
[spreadsheetapp-docs]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
[triggers-docs]: https://developers.google.com/apps-script/guides/triggers/installable
[mailapp-docs]: https://developers.google.com/apps-script/reference/mail/mail-app
