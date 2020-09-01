---
title: Send personalized appreciation certificate to employees
description: Automatically customize an existing Google Slide certificate template with employee data in Google Sheets and share them using Gmail.
labels: Slides, Sheets, Apps Script, Gmail, Drive
material_icon: emoji_events
create_time: 2020-09-01
update_time: 2020-09-01
---

Manually creating customized employee certificates in Google Slides can be tiresome. Having to download, attach and send them to each individual can get equally cumbersome. Google Apps Script is the perfect tool to simplify such repetitive work and also eliminate any accidents that end-up having one employee get an appreciation certificate of another.

This setup would make use of the 'Employee Certificate' template from Google Slides and a Google Sheet with all the employee details. The script would start by making a copy of the template and replace some of the key placeholders (like Employee Name, Company Name etc.) with data from the sheet. Once a slide for every employee is created, we then run another function that would extract individual slides as a PDF attachment and send it to each employee's email ID.

![employee-certificate-gif](https://user-images.githubusercontent.com/37455462/91755079-25f56280-ebe8-11ea-9b19-725744400893.gif)

## Technology highlights
- The [`DriveApp` service](https://developers.google.com/apps-script/reference/drive/drive-app) is used to make copies of the original Google Slides template
- The [`SpreadsheetApp` service](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app) is used to refer employee details and update the status against each of them
- The [`SlidesApp` service](https://developers.google.com/apps-script/reference/slides/slides-app) is used to replace the placeholders from the template, with actual employee data
- The [`GmailApp` service](https://developers.google.com/apps-script/reference/gmail/gmail-app) is used to get the individual slides as a PDF and send it to respective employee's email ID

## Try it
- Create a copy of the [Employee certificate slide](https://docs.google.com/presentation/d/1bFj09xI7g_kbA76Xb60tYyxVdi-zrpm6zQ6gu696vKs/copy) template
- Create a copy of the sample [Employee data spreadsheet](https://docs.google.com/spreadsheets/d/1cgK1UETpMF5HWaXfRE6c0iphWHhl7v-dQ81ikFtkIVk/copy)
- Make a copy of the [Apps Script file](https://script.google.com/d/1cjD-P2NQrbshysRGUsGTwmH_V1BF_RSNSjzfHSvfFHTZ4a8npFCe5GNB/edit) by navigating to *File > Make a copy* or create a new script file by navigating to [script.new](https://script.new) and copy everything from the [source code](src/Code.gs) file into it

## Next steps

To get started with Google Apps Script, try out [the codelab](https://codelabs.developers.google.com/codelabs/apps-script-intro) which guides you through the creation of your first script.

You can also view the [full source code](https://github.com/schoraria911/google-apps-script/blob/master/Random/Employee%20certificate/code.gs) of this solution on GitHub to learn more about how it was built.
