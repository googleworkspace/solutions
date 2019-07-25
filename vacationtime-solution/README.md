# Manage Employee Vacation Time Requests

_Quickly approve/disapprove employees' vacation time requests, and 
create calendar events or send notification emails accordingly.._

Last updated: July, 2019

A Google Form is a great tool for employees to quickly submit vacation
time requests in a uniform manner. However, it can be difficult for employers
to deal with everybody's requests at once, and send the correct e mails/create 
the correct calendar events accordingly.

This solution uses [Google Apps Script][apps-script] to generate a Google Sheet
and apropriate columns based on employees' vacation time requests. When an employee
submits a request through a Google Form, the employer solely needs to load the Form
responses into a Google Sheet, run the Apps Script code, and mark approval/disapproval
column values as necessary. The script will then notify employees of their disapproved
requests through automated emails, or create a shared calendar event between
manager and employee for those with approved requests.
Now, managers can easily see on their calendars when certain employees will be on
vacation, and have dealt with all other requests appropriately and with the simple
click of a button.

[apps-script]: https://developers.google.com/apps-script

## Technology highlights

- The script sends automated e mails to employees with 'NOT APPROVED' status
  using [MailApp][mail-app].
- This solution uses [FormApp][form-app] & an HTML template to notify the manager 
  when a new form response has been submitted.
- The script creates shared calendar events between manager and employee using
  [CalendarApp][cal-app].
- The script sets certain columns to contain drop-down menu cells using 
  [Data Validation rules][data-val].

[form-app]: https://developers.google.com/apps-script/reference/forms/form-app
[mail-app]: https://developers.google.com/apps-script/reference/mail/mail-app
[cal-app]: https://developers.google.com/apps-script/reference/calendar/calendar-app
[data-val]: https://developers.google.com/apps-script/reference/spreadsheet/data-validation-builder


## Try it out!

First, set up your Google Form:
1. Create a copy of the sample [Employee Time Off Request Form][request-form].
1. On this form hit **Edit > View Summary***. Click the three summary dots in the top right corner, and click on **Select Response Destination** from the drop-down.
1. For your response destination, create a new sheet & name it whatever you'd like. Your form responses will now appear in this sheet.

Second, set up your Google Sheet:
1. On your created Google Sheet, go to **Tools > Script Editor**
1. Copy + Paste the given Code.gs code into the Script Editor, and hit Save. Now refresh your spreadsheet.

Lastly, run the AppsScript functions:
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new **TimeOff** menu. Click it, and select the first drop-down option, **Form Setup**. This will set up the 'onFormSubmit' trigger to notify your manager when a new response has been submitted. Great!
1. Next, select the second drop-down option, **Manager Approval**. In the last column you will now be able to approve/disapprove each employee’s request.
1. Click on **TimeOff > Notify Employees**. A Google Calendar event with the corresponding start + end time will be created for every employee whose vacation has been approved. A notification email of disapproval will be sent to employees with disapproved requests.
1. A new column entitled “NOTIFICATION STATUS” has now appeared, indicating which employees have versus have not been notified. This ensures a manager does not send out double emails. 

When completed, check your Google Calendar to see all of the new events created between you (manager)
and employees with approved time-off requests.
Additionally, visit your (manager's) GMail account, and look in your Sent folder to see all of 
the notification e mails sent to employees with unapproved requests.

[request-form]: https://forms.gle/DZ6BFS9n8PkC2ivQ9

## Next steps

You can view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[github]: /**GITHUB LINK HERE**/

