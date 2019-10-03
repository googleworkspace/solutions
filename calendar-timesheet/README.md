---
title: Record time and activities in Calendar and Sheets
description: Create calendar events for your activities, and synchronise to your timesheet in sheets for reporting.
labels: Apps Script, Sheets, Calendar
material_icon: event
create_time: 2019-09-08
update_time: 2019-09-08
---

Contributed by Jasper Duizendstra, follow me at [@Duizendstra](https://twitter.com/duizendstra)

Keeping track of the time spent on project for customers can be a challenge. Not all time writing
apps are user friendly and sometimes you need to record your time in multiple systems. You can end up
spending a lot of time writing time on a daily basis in a stubborn system and synchronise that time to
other systems.  

To solve this problem we can use the one time related application we have open every
day, Google Calendar. In an additional calendar we can quickly add an event for the appropriate
timeslot. Then add a short description and forget about it. Art the end of the week you synchronise the
calendar with a Google sheet. Categorize by customer, project and task based on the description and the
data is structured for further processing. Use the dashboard or write a simple query to report or copy
in other time sheets.


![screenshot](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/calendar-timesheet/calendar-to-sheet-screenshot.png)

## Technology highlights

- The [`SpreadsheetApp` service][spreadsheetapp-docs] is used to write the events to the sheet
- [Custom Menus](https://developers.google.com/apps-script/guides/menus) are used to trigger the synchronisation
- The [`CalendarApp` service][calendarapp-docs] is used to write the events to the sheet


## Try it

1. Create your secondary calendar: [Create a new calendar][create-calendar]
1. Copy the calendar id. This can be found in the calendar settings
1. Copy this [sheet][sheet-copy]
1. In the configuration tab you paste the id of the calendar you created in step one.
1. Add some events to the secondary calender and hit **MyTime -> Sync** calendar events

## Next steps

_This solution is based on this [article][article-medium]_

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/gsuitedevs/solutions/blob/master/calendar-timesheet
[create-calendar]:[https://support.google.com/calendar/answer/37095]
[spreadsheetapp-docs]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
[calendarapp-docs]: https://developers.google.com/apps-script/reference/spreadsheet/calendar-app
[sheet-copy]: https://docs.google.com/spreadsheets/d/1ay_SBrFhIqbJs0-ifgU7E8jg4dmBbLlc4yIS_-PPSXA/copy
[article-medium]: https://medium.com/@duizendstra/record-time-and-activities-with-google-sheets-calendar-and-apps-script-41bf69244346
