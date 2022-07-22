---
title: Sign up for activities at an offsite or event
description: Create an offsite activity signup system. Lets attendees pick their preferred activities via a form and fairly assigns them based on availability.
labels: Apps Script, Sheets, Forms
material_icon: poll
create_time: 2019-06-12
update_time: 2019-07-23
---

Quickly create an end to end offsite activity signup system. Start with the activity schedule in a Google Sheet, then
use Apps Script to create a form for attendees to express their preferences. After everyone submits their responses,
assign the activities to best match their preferences, activity capacities, and schedules.

![demo][screenshot]

## Technology highlights

- The [`FormApp` service][formapp-docs]
  is used to create a sign-up form based on a schedule of activities in the sheet.
- The [`SpreadsheetApp` service][spreadsheetapp-docs]
  is used to read the form responses and record the activity assignments and rosters
  in the spreadsheet.
  
## Try it

1. Create a copy of the sample [Offsite Activity Signup spreadsheet][sheet].
1. Click on custom menu item **Activities** > **Create Form**.
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice
   and continue.
1. Click on custom menu item **Activities** > **Generate test data** to generate sample responses.
1. Click **Form** > **Go to live form**.
1. Fill out the form and submit your own response.
1. Return to the sheet.
1. Click on custom menu item **Activities** > **Assign activities**.
1. Two new sheets will appear with the activity assignments. View them.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[screenshot]: https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/offsite-activity-signup/screenshot.png
[sheet]: https://docs.google.com/spreadsheets/d/1oAY9-EclfLWcxpxGcyqA47Y_SBdxOvX0wffYUFFxjZY/copy
[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/offsite-activity-signup
[formapp-docs]: https://developers.google.com/apps-script/reference/forms/form-app
[spreadsheetapp-docs]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
