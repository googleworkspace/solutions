# Manage employee time sheets 

Allows employers to view their employees' weekly timesheets, easily calculate
their weekly pay, and send automated emails notifying them of timesheet
approval/disapproval status.

## Description

Quickly create a hands-free employee pay management system. Start with
collecting employees' timesheets in a Google Form, then use Apps Script to
create a spreadsheet to easily view, compile, and manage their data. After
everybody submits their responses, calculate their pay, approve or disapprove
their pay, and auto-send emails notifying them of their pay status.

## Set-Up Instructions

1. Create a copy of the sample [Employee Weekly TimeSheet Form](***LINK***).
1. Create a copy of the sample [Timesheets] Google Sheet
   (https://docs.google.com/spreadsheets/d/1Yp8ZCcSrm2l7xpLx2GAxzSBsIUBpzjALtqnuZ8huUfE/edit?usp=sharing).
1. Once you've received responses, on your google form hit **Edit > View
   Summary***. Click the three summary dots in the top right corner, and click
on **Select Response Destination** from the drop-down.
1. Select the new Google Sheet you just created (the copy of the given sheet).
   The Form responses will now appear in this sheet.
1. A dialog box will appear and tell you that the script requires authorization.
   Read the authorization notice and continue.
1. You will see a new **Timesheets** menu. Click it and select **Column Setup**.
   You will now see columns for weekly pay values, approval status, and notified
status.
1. Click on **Timesheets> Calculate Pay**. The “WEEKLY PAY” column will now be
   updated with each employee’s weekly pay value.
1. Use the drop down values of the “APPROVAL” column to either approve or
   disapprove each employee’s weekly pay.
1. Click on **Timesheets > Send Emails** in order to auto-send emails to every
   employee notifying them of their approval status. You will see the values in
the “NOTIFIED” column change, which are in place to ensure the employer does not
send out double emails. 


