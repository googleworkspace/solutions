# Manage employee timesheets.
_Quickly approve/disapprove of employees' weekly timesheet submissions, and
send them automated notification emails after doing so._

Last updated: July, 2019

Quickly create a hands-free employee pay management system. Start with
collecting employees' timesheets in a Google Form, then use [Apps Script][apps-script] to
create a spreadsheet to easily view, compile, and manage their data. After
everybody submits their responses, calculate their pay, approve or disapprove
their pay, and auto-send emails notifying them of their pay status.

![demo](TimesheetsScreenRecording.webm)

[apps-script]: https://developers.google.com/apps-script/

## Technology highlights

- The script uses [MailApp][mail-app] to send employees automated emails.
- The solution uses [Data Validation Rules][data-val] to set certain columns
  to all drop-down values.

[mail-app]: https://developers.google.com/apps-script/reference/mail/mail-app
[data-val]: https://developers.google.com/apps-script/reference/spreadsheet/data-validation-builder

## Set-Up Instructions
First, set up your Spreadsheet:
1. Create a copy of the sample [Timesheets Responses][sheet-link] Google Sheet.
   
Next, set up your Google Form:
1. Create a copy of the sample [Employee Weekly Timesheet Form][form-link].
1. Once you've received responses, on your google form hit **Edit > View Summary***. 
   Click the three summary dots in the top right corner, and click on **Select Response 
   Destination**   from the drop-down.
1. Select the new Google Sheet you just created (the copy of the given sheet).
   The Form responses will now appear in this sheet.

Let's get your script! running!
1. Inside of the selected Sheet, a dialog box will appear and tell you that the script requires authorization.
   Read the authorization notice and continue.
1. You will see a new **Timesheets** menu. Click it and select **Column Setup**.
   You will now see columns for weekly pay values, approval status, and notified
   status.
1. You will notice that the WEEKLY PAY column is full of values - these were
   calculated upon setup, so the work is taken care of for you!
1. Use the drop down values of the “APPROVAL” column to either approve or
   disapprove each employee’s weekly pay.
1. Click on **Timesheets > Notify Employees** in order to auto-send emails to every
   employee notifying them of their approval status. You will see the values in
   the “NOTIFIED” column change, which are in place to ensure the employer does not
   send out double emails. 

[sheet-link]: https://docs.google.com/spreadsheets/d/17NJu4XTUsfCVPYHSqBCDGYDxJoADfwj2HP0QRD4-ihc/copy
[form-link]: https://docs.google.com/forms/u/1/d/1WzMCjbM_HPl7NGvix5SCruhVky6ZoZ5Xq-3maC8UH9E/copy


