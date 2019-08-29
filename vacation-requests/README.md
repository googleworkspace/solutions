---
title: Manage employee vacation time requests
description: >
  Quickly approve employees' vacation time requests, and create calendar events or send notification emails accordingly.
labels: Apps Script, Sheets, Forms, Calendar
material_icon: pool
update_time: 2019-08-26
---

# Manage Employee Vacation Time Requests

_Quickly approve employees' vacation time requests, and 
create calendar events or send notification emails accordingly._

Last updated: August, 2019

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

![demo](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/vacation-requests/VacationRequestsRecording.gif)
[apps-script]: https://developers.google.com/apps-script

## Technology highlights

- The script sends automated e mails to employees with 'NOT APPROVED' status
  using [MailApp][mail-app].
- This solution uses [FormApp][form-app] to create a new form upon 'Form Setup'.
- This solution uses an HTML template and a [FormApp][form-app] trigger to notify the manager once a new form response is submitted.
- The script creates shared calendar events between manager and employee using
  [CalendarApp][cal-app].
- The script sets certain columns to contain drop-down menu cells using 
  [Data Validation rules][data-val].

[form-app]: https://developers.google.com/apps-script/reference/forms/form-app
[mail-app]: https://developers.google.com/apps-script/reference/mail/mail-app
[cal-app]: https://developers.google.com/apps-script/reference/calendar/calendar-app
[data-val]: https://developers.google.com/apps-script/reference/spreadsheet/data-validation-builder


## Try it out!

1. Create a copy of the sample [Vacation Time Requests Sheet][request-sheet], and name it something you'll remember.
1. You will see a new **TimeOff** menu. Click it, and select the first drop-down option, **Form Setup**. 
1. In your sheet, adialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. Once **Form Setup** has finished running, enter your Google Forms and you will see a new 'Vacation Time Requests' form. This form is already linked to your sheet, & you can send it out to employees to collect their responses.
1. Once this form receives responses, you (manager) will be notified by email and you will see the responses appear in your Sheet.
1. Next, select the second drop-down option, **Column Setup**. You will see two new columns: first, an approval column, allowing you to approve/disapprove of each employee's vacation time request via drop-down menu options. Second, a notification column, indicating which employees have/have not been notified of their approval status, set to 'NOT NOTIFIED' on default.
1. Once you've approved/disapproved your employees' requests, click on **TimeOff > Notify Employees**. A Google Calendar event with the corresponding start + end time will be created for every employee whose vacation has been approved. A notification email of disapproval will be sent to employees with disapproved requests.
1. In the 'NOTIFICATION STATUS' column, values will now be updated, indicating which employees have versus have not been notified. This ensures a manager does not send out double emails. 

When completed, check your Google Calendar to see all of the new events created between you (manager)
and employees with approved time-off requests.
Additionally, visit your (manager's) GMail account, and look in your Sent folder to see all of 
the notification e mails sent to employees with unapproved requests.

[request-sheet]: https://docs.google.com/spreadsheets/u/1/d/17PKWX66mcKsyHjLTA7STkes0qhvtL2N6dklTzxtogZg/copy

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/gsuitedevs/solutions/tree/master/vacation-requests
