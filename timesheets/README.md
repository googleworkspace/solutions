# Manage employee time sheets 

Allows employers to view their employees' weekly timesheets, easily calculate their weekly pay, and send automated emails notifying them of timesheet approval/disapproval status.

## Description

Quickly create a hands-free employee pay management system. Start with collecting employees' timesheets in a Google Form, then use Apps Script to create a spreadsheet to easily view, compile, and manage their data. After everybody submits their responses, calculate their pay, approve or disapprove their pay, and auto-send emails notifying them of their pay status.

## Set-Up Instructions

1. Create a copy of the sample [Employee Weekly TimeSheet Form](***LINK***).
1. Once you've received responses, on your google form hit **Edit > View Summary***. Click the three summary dots in the top right corner, and click on **Select Response Destination** from the drop-down.
1. Create a new Google Sheet and name it whatever you'd like. The Form responses will now appear in this sheet.
1. On your Google Sheet, go to **Tools > Script Editor**
1. Copy + Paste the given code into the Script Editor, and hit Save. Now refresh your spreadsheet.
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new **Run Functions** menu. Click it and select **Calculate Pay. In the last column you will now be able to view each employee's weekly pay.
1. Click on **Run Functions > Add Approval**. A new column will appear with checkboxes in every row. Check a box to indicate an employee's timesheet and pay has been approved.
1. Click on **Run Functions > Send Emails**. An email will be sent out to every employee notifying them of their approval status.



:wq
:q
