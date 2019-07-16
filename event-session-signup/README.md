# Sign Up for Sessions at an Event

_Allows event attendees to sign up for sessions at an event and creates an itinerary._

Last updated: July, 2019

Quickly create an end to end conference registration system. Start with the
conference event information listed in a Google Sheet, then use Apps Script to
create a sign-up form. For each attendee, a personalized schedule in a Google
Doc is emailed out and a conference calendar is created then populated with the
specific sessions.

![demo](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/event-session-signup/event-signup.jpg)

## Technology highlights

- Create a custom menu item in the Spreadsheet UI using Apps Script [Custom Menus](https://developers.google.com/apps-script/guides/menus).
- Use the [onFormSubmit](https://developers.google.com/apps-script/guides/triggers/events#form-submit_4)
  trigger to create and email the personalized schedule for each attendee when
  the user submits the form.
- Use [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app) to send emails.

## Try it

1. Create a copy of the sample [Event Session spreadsheet](https://docs.google.com/spreadsheets/d/1cpGsysprd5zl8VHYs4njsTSXwGxMA7DZPCW5o2EhR_8/copy)
1. Click on custom menu item 'Conference' > 'Set up conference'
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. The Conference menu will now be gone, but you will see a new Form menu instead. Click it and select Go to live form.
1. Fill out the form
1. Check your email for your personalized itinerary and check your Calendar on May 13th to see your registered sessions

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/gsuitedevs/solutions/blob/master/event-session-signup
