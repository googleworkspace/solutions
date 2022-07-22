---
title: Collect timesheets from employees
description: Create a hands-free employee pay management system. Lets managers approve/disapprove employees' weekly timesheets & automatically notify them of this status.
labels: Apps Script, Sheets, Forms
material_icon: alarm
create_time: 2019-07-10
update_time: 2019-08-05
---

Quickly create a hands-free employee pay management system. Start with
collecting employees' timesheets in a Google Form, then use
[Apps Script][apps-script] to create a spreadsheet to easily view, compile, and
manage their data. After everybody submits their responses, calculate their pay,
approve or disapprove their pay, and auto-send emails notifying them of their
pay status.

![demo](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/timesheets/TimesheetsRecording.gif)

[apps-script]: https://developers.google.com/apps-script/

## Technology highlights

-   The script uses [MailApp][mail-app] to send employees automated emails.
-   The solution uses [Data Validation Rules][data-val] to populate drop-down
    values.

[mail-app]: https://developers.google.com/apps-script/reference/mail/mail-app
[data-val]: https://developers.google.com/apps-script/reference/spreadsheet/data-validation-builder

## Set-Up Instructions

1.  Create a copy of the sample [Timesheets Responses][sheet-link] Google Sheet.
1.  Inside of this sheet, you will see a new **Timesheets** menu. Click it and
    select **Form Setup**.
1.  A dialog box will appear and tell you that the script requires
    authorization. Read the authorization notice and continue.
1.  Once **Form Setup** finishes running, you will see a new Form in your Google
    Drive entitled "Employee Weekly Timesheets." You can now send this Form out
    to your employees & have them fill in their information accordingly. You
    will see any new Form responses fill into new rows of your Sheet.
1.  Once you've received responses, go back to the **Timesheets** menu and
    select **Column Setup**.
1.  You will now see columns for weekly pay values, approval status, and
    notified status.
1.  You will notice that the **WEEKLY PAY** column is full of values - these
    were calculated upon setup, so the work is taken care of for you.
1.  Use the drop down values of the **APPROVAL** column to either approve or
    disapprove each employee’s weekly pay.
1.  Click on **Timesheets > Notify Employees** in order to auto-send emails to
    every employee notifying them of their approval status. You will see the
    values in the **NOTIFIED** column change.

[sheet-link]: https://docs.google.com/spreadsheets/d/17NJu4XTUsfCVPYHSqBCDGYDxJoADfwj2HP0QRD4-ihc/copy
