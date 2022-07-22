---
title: Automatically populate a team vacation calendar
description: Quickly see when your colleagues are out of the office, with no manual entry required.
labels: Apps Script, Calendar
material_icon: event
create_time: 2019-07-11
update_time: 2019-08-19
---

A shared vacation calendar is a great tool for helping your team collaborate;
anyone can determine who's out of the office at a glance. However, booking time
off is already a chore, and an additional step to update the calendar can be
easy to forget.

This solution uses [Google Apps Script][apps-script] to automatically populate
a shared vacation calendar based on the individual calendars of each person on
the team. When someone books time off they just need to remember to add an event
to their personal Google Calendar using a keyword like "Vacation" or "Out of
office." The script acts behind the scenes, scanning the calendars of all the
members in a Google Group and syncing appropriate events to the shared calendar.

Note: This solution only accesses Calendar events that your colleagues have made
visible to you via their [privacy settings][privacy_settings].

![demo](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/vacation-calendar/demo.gif)

[apps-script]: https://developers.google.com/apps-script
[privacy_settings]: https://support.google.com/calendar/answer/34580

## Technology highlights

- The script runs automatically on a fixed schedule using Apps Script's
  [time-driven triggers][time_driven_triggers].
- The [`GroupsApp` service][groupsapp] is used to determine the members of the
  team's Google Group.
- The [Advanced Calendar Service][calendar_advanced] provides access to the
  [Calendar API][calendar_api] and the ability to search for events on your
  colleague's calendar.

[time_driven_triggers]: https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
[groupsapp]: https://developers.google.com/apps-script/reference/groups/groups-app
[calendar_advanced]: https://developers.google.com/apps-script/advanced/calendar
[calendar_api]: https://developers.google.com/calendar/

## Try it

First, set up Google Calendar:

1. Open [Google Calendar][calendar] in your browser.
1. [Create a new calendar][calendar_setup] called "Team Vacations."
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
1. Select your Google Workspace account from the list.
1. Click the **Allow** button.

When complete, return to Google Calendar to see the Team Vacations calendar
populated with events. For a more detailed record of what the script did, you
can view the logs by clicking
**View > Stackdriver Logging** and then **Apps Script Dashboard**.

[project]: https://script.google.com/d/1Z00KFsXZSLMYw1Tsf7gXqxEt4LjTYtyrnc0EHel43sHs6dl8_z5mHze2/edit
[calendar]: https://calendar.google.com
[calendar_setup]: https://support.google.com/calendar/answer/37095

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/vacation-calendar
