# Automatically populate a team vacation calendar

Quickly see when your colleagues are out of the office, with no manual entry
required.

[Read more](https://developers.google.com/gsuite/solutions/vacation-calendar)

## Setup

<!-- [START setup] -->

First, set up Google Calendar:

1. Open [Google Calendar][calendar] in your browser.
1. [Create a new calendar][calendar_setup] called "Team Vacations".
1. Still in the settings screen, select the new calendar from the left menu.
1. Scroll to **Integrate calendar** and copy the value under **Calendar ID**.

Next, create the Apps Script project:

1. Open the [Apps Script project][project] in your browser.
1. Click the menu item **File > Make a copy...**.
1. Set the variable `TEAM_CALENDAR_ID` to the ID of the calendar you
   created earlier.
1. Set the variable `GROUP_EMAIL` to the email address of a Google Group
   containing your team members.

Then run the script:

1. Click the **Select function** dropdown and select **setup**.
1. Click the Run button (►).
1. When prompted, click the **Review permissions** button.
1. Select your G Suite account from the list.
1. Click the **Allow** button.

When complete, return to Google Calendar to see the Team Vacations calendar
populated with events. For a more detailed record of what the script did, you
can view the logs by clicking
**View > Stackdriver Logging** and then **Apps Script Dashboard**.

[project]: https://script.google.com/d/1Z00KFsXZSLMYw1Tsf7gXqxEt4LjTYtyrnc0EHel43sHs6dl8_z5mHze2/edit
[calendar]: https://calendar.google.com
[calendar_setup]: https://support.google.com/calendar/answer/37095

<!-- [END setup] -->
