# Automatically populate a team vacation calendar

Quickly see when your colleagues are out of the office, with no manual entry
required.

[Read more](https://developers.google.com/gsuite/solutions/vacation-calendar)

## Setup

<!-- [START setup] -->

1. Open the [Apps Script project][project] in your browser.
1. Click the menu item **File > Make a copy...**.
1. Set the variable `TEAM_CALENDAR_ID` to the ID of a Google Calendar you have
   edit access to.
1. Set the variable `GROUP_EMAIL` to the email address of a Google Group
   containing your team members.
1. Click the **Select function** dropdown and select **setup**.
1. Click the Run button (►).
1. When prompted, click the **Review permissions** button.
1. Select your G Suite account from the list.
1. Click the **Allow** button.

When complete, open the team calendar to see the copied events. For a more
detailed record of what the script did, you can view the logs by clicking
**View > Stackdriver Logging** and then **Apps Script Dashboard**.

[project]: https://script.google.com/d/1Z00KFsXZSLMYw1Tsf7gXqxEt4LjTYtyrnc0EHel43sHs6dl8_z5mHze2/edit

<!-- [END setup] -->
