---
title: Agenda Maker for Google Calendar
description: Creates an agenda for a calendar event you create automatically.
labels: Apps Script,  Calendar
material_icon: event
create_time: 2020-07-19
update_time: 2020-07-19
---

Contributed by Jeremy Glassenberg [Site](https://www.apistrategist.com)

So many meetings are time lost. No agenda means no one is prepared to discuss. No minutes means no one will remember what was decided. Most companies ask everyone to set agendas for their meetings, but can't create a good habit.

It's just too burdensome to create an agenda, but very easy to create a meeting. With Agenda maker, the process of creating an agenda is much easier.

By simply adding "#agenda" to the description of your Google Calendar invite, an agenda will be created for your meeting, with a Google Docs reminder to fill it in.

Design Details

![demo](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/agenda-maker/AgendaMakerScreenshot.png)

## Technology highlights

- Uses [Apps Script][apps_script], allowing for rapid development and worry-free operation.
- Uses the [Google Docs API][gdocs_api] to create a new Google Doc from the Agenda Template
- Uses the [Google Drive API][gdrive_api] to set up an agenda folder
- Uses the [Calendar API][calendar_api] to detect new events and update the event description with a link to the Agenda.

[apps_script]: https://developers.google.com/apps-script/
[gdrive_api]: https://developers.google.com/drive/api/
[gdocs_api]: https://developers.google.com/docs/api/
[calendar_api]: https://developers.google.com/calendar/

## Try it

First, create the script:

1.  [Click here][code] to open the code in the Apps Script code editor.
2.  Click the menu item **File > Make a copy** to get your own copy. You can
    later access this copy in the [Google Workspace Developer Hub][hub].
3. Run the `setUp` function to set up a trigger for calendar changes.

[code]: https://script.google.com/d/1Q-lPfAtsADktF1cpW0x9qw0CuMAXUiqiusfvz6WW4u2FXP1XMprxL7ZH/edit?usp=sharing
[hub]: https://script.google.com

Finally, test that your script is working:

1.  Open [Google Calendar][calendar].
2.  Begin creating a new event.
3.  In the description, enter a description you'd like, and add "#agenda" where you'd like to create the agenda.
4. Wait for an email from Google Docs, or refresh Google Calendar and click on the event again. You should see a link to a newly created Agenda document to edit.

Note: All attendees will receive the invitation from Google Docs in addition to your invite, to view the agenda.  They will have editing rights, but you can adjust the script to give commenter or viewer rights.

[calendar]: https://calendar.google.com

If you'd like to adjust the style of the Agenda template:
1. After creating your first agenda in a calendar event, visit to your Google Drive account.
2. In Google Drive there should be a folder named "Agenda Maker - App."
3. Within that folder, look for the file named "Agenda TEMPLATE##."  This is the template you can adjust.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[github]: https://github.com/googleworkspace/solutions/blob/main/agenda-maker
[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
