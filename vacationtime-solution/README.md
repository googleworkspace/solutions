# Manage employee vacation/time off requests

Allows employers to easily view and manage their employees' requests for vacation time/time off. If approved, a shared Google Calendar event will be created with the corresponding vacation start & end times. If not approved, employees will be notified via email. 

## Description

Quickly create a hands-free employee vacation-time request management system. Start with collecting employees’ time-off/vacation requests in a Google Form, then use Apps Script to create a spreadsheet to easily view, approve/disapprove, and communicate status employees (through either notification email or Google Calendar event invitation).

## Set-Up Instructions

1. Create a copy of the sample [Employee Time Off Request Form](https://forms.gle/DZ6BFS9n8PkC2ivQ9).
1. Once you've received responses, on your google form hit **Edit > View Summary***. Click the three summary dots in the top right corner, and click on **Select Response Destination** from the drop-down.
1. Create a new Google Sheet and name it whatever you'd like. The Form responses will now appear in this sheet.
1. On your Google Sheet, go to **Tools > Script Editor**
1. Copy + Paste the given code into the Script Editor, and hit Save. Now refresh your spreadsheet.
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new **TimeOff** menu. Click it and select **Manager Approval**. In the last column you will now be able to approve/disapprove each employee’s request.
1. Click on **TimeOff > Notify Employees**. A Google Calendar event with the corresponding start + end time will be created for every employee whose vacation has been approved. A notification email of disapproval will be sent to employees otherwise.
1. A new column entitled “NOTIFICATION STATUS” has now appeared, indicating which employees have versus have not been notified. This ensures a manager does not send out double emails. 






