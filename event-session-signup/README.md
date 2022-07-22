---
title: Sign up for sessions at an event
description: Allows event attendees to sign up for sessions at an event then creates and emails a personalized itinerary.
labels: Apps Script, Sheets, Forms, Docs, Gmail
material_icon: event
create_time: 2019-06-20
update_time: 2019-07-31
---

Quickly create an end to end conference registration system. Start with the
conference event information listed in a Google Sheet, then use Apps Script to
create a sign-up form. For each attendee, a personalized schedule in a Google
Doc is emailed out and a conference calendar is created then populated with the
specific sessions.

![demo](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/event-session-signup/event-signup.jpg)

## Technology highlights

- Create a custom menu item in the spreadsheet UI using Apps Script [Custom Menus](https://developers.google.com/apps-script/guides/menus).
- Use the [onFormSubmit](https://developers.google.com/apps-script/guides/triggers/events#form-submit_4)
  trigger to create and email the personalized schedule for each attendee when
  the user submits the form.
- Use [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app) to send emails.

## Try it

1. Create a copy of the sample [Event Session spreadsheet](https://docs.google.com/spreadsheets/d/1cpGsysprd5zl8VHYs4njsTSXwGxMA7DZPCW5o2EhR_8/copy)
1. Click on custom menu item **Conference > Set up conference**
1. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.
1. You will see a new Form menu instead. Click it and select **Go to live form**.
1. Fill out the form
1. Check your email for your personalized itinerary and check your calendar for the week of May 13th, 2019 to see your registered sessions

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/event-session-signup
