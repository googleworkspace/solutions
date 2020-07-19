Solution title: Agenda Maker for Google Calendar

One sentence summary: Creates an agenda for a calendar event you create automatically

Description (1 - 2 paragraphs):

So many meetings are time lost. No agenda means no one is prepared to discuss. No minutes means no one will remember what was decided. Most companies ask everyone to set agendas for their meetings, but can't create a good habit.

It's just too burdensome to create an agenda, but very easy to create a meeting. With Agenda maker, the process of creating an agenda is much easier.

By simply adding "#agenda" to the description of your Google Calendar invite, an agenda will be created for your meeting, with a Google Docs reminder to fill it in.

Design Details:


![demo](https://github.com/jglassenberg/appscript-calendar-agendas/blob/master/AgendaMakerScreenshot.png)

## Technology highlights

- Uses [Apps Script][apps_script], allowing for rapid
  development and worry-free operation.
- Uses the [Google Docs API][gdocs_api] to create a new Google Doc from the Agenda Template
- Uses the [Google Drive API][gdrive_api] to set up an agenda folder
- Uses the [Calendar API][calendar_api] to detect new events and update the event description with a link to the Agenda.

[app_script]: https://developers.google.com/apps-script/
[gdrive_api]: https://developers.google.com/drive/api/
[gdocs_api]: https://developers.google.com/docs/api/
[calendar_api]: https://developers.google.com/calendar/

## Try it

First, create the script:

1.  [Click here][code] to open the code in the Apps Script code editor.
2.  Click the menu item **File > Make a copy** to get your own copy. You can
    later access this copy in the [G Suite Developer Hub][hub].

[code]: https://script.google.com/home/projects/1YJjo1s8TUnbGlYUOYSUw4Y30R0uihSMw4Yz-V6UGfr4Wbll4ETXNohD8/edit
[hub]: https://script.google.com


Finally, test that your script is working:

1.  Open [Google Calendar][calendar].
2.  Begin creating a new event.
3.  In the description, enter a description you'd like, and add "#agenda" where you'd like to create the agenda.
4. Wait for an email from Google Docs, or refresh Google Calendar and click on the event again. You should see a link to a newly created Agenda document to edit.

Note: All attendees will receive the invitation from Google Docs in addition to your invite, to view the agenda.  They will have editing rights, but you may adjust the script to give commenter or viewer rights.

[calendar]: https://calendar.google.com

If you'd like to adjust the style of the Agenda template:
1. After creating your first agenda in a calendar event, visit to your Google Drive account.
2. In Google Drive there should be a folder named "Agenda Maker - App".
3. Within that folder, look for the file named "Agenda TEMPLATE##".  This is the template you can adjust.



## Next steps

To learn more about how the bot was made, follow [this codelab][codelab] for
detailed instructions on each step in the process. You can also view the
[full source code][github] of this solution on GitHub if you want to jump right
to the end.

[codelab]: https://codelabs.developers.google.com/codelabs/
[github]: https://github.com/googlecodelabs/

(The code is ready in a Github repo, from which I'd be happy to transfer everything here)
