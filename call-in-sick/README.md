---
title: Call in sick with a custom bot for Hangouts Chat
description: Update your calendar and auto-responder with a single message to your custom bot.
labels: Apps Script, Hangouts Chat, Gmail, Calendar
material_icon: sentiment_very_dissatisfied
create_time: 2019-08-02
update_time: 2019-08-02
---

When you wake up feeling ill the last thing you want to do is log in to your
work account and update your status in multiple applications. With this
solution, you simply send the message "I'm sick" to a custom bot in Hangouts
Chat and it will turn on your out of office message in Gmail and block off
your day in Google Calendar.

<!-- TODO: Fix update image path to "master" before comitting. -->

![demo](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@call-in-sick/call-in-sick/demo.png)

## Technology highlights

- Uses the [Hangouts Chat API][hangouts_chat_api] to build a chat bot, which you
  can message just like a human participant.
- The bot is implemented using [Apps Script][apps_script], allowing for rapid
  development and worry-free operation.
- Uses the [Gmail API][gmail_api] to set the user's out-of-office
  auto-responder.
- Blocks off the user's calendar using the [Calendar API][calendar_api].

[hangouts_chat_api]: https://developers.google.com/hangouts/chat/
[app_script]: https://developers.google.com/apps-script/
[gmail_api]: https://developers.google.com/gmail/api/
[calendar_api]: https://developers.google.com/calendar/

## Try it

First, create the script:

1.  [Click here][code] to open the bot code in the Apps Script code editor.
1.  Click the menu item **File > Make a copy** to get your own copy. You can
    later access this copy in the [G Suite Developer Hub][hub].

[code]: https://script.google.com/d/1pbuGhMkTyqfeR30QfbMzsA21qM2p0HmnStGpZUKj-QLvH0BL73UbTlSq/edit
[hub]: https://script.google.com

Then create a Google Cloud project to use with it:

1.  [Create a new project][new_project] in the Google Cloud Developer Console.
    Name it "Call in Sick", select a **Billing Account** if prompted, and
    click **CREATE**. More information on how to setup billing [here][billing].
1.  When the project creation is complete a notification appears in the
    upper-right of the page. Click on the **Create Project: Call in Sick** entry
    to open the project.
1.  Open the [**OAuth consent screen**][consent_screen] settings page for the
    project.
1.  In the field **Application name** enter "Attendance Bot" and click the
    **Save** button at the bottom.
1.  Open the [**Gmail API**][library_gmail] page in the API library and click
    the **ENABLE** button.
1.  Open the [**Project settings**][project_settings] page for the project.
1.  Copy the value listed under **Project number**.

[new_project]: https://console.cloud.google.com/projectcreate
[billing]: https://cloud.google.com/free/docs/gcp-free-tier
[consent_screen]: https://console.cloud.google.com/apis/credentials/consent
[library_gmail]: https://console.cloud.google.com/apis/library/gmail
[project_settings]: https://console.cloud.google.com/iam-admin/settings

Next, setup your script to use the new project and deploy it:

1.  Back in the Apps Script Code Editor, click the menu item
    **Resources > Cloud Platform project**.
1.  Enter the project number into the text box and click **Set Project**. When
    prompted, click **Confirm**.
1.  When complete, click the **Close** button or **X** icon to dismiss the
    dialog.
1.  Click the menu item **Publish > Deploy from manifest**.
1.  Next to the entry **Latest Version (Head)** click **Get ID**.
1.  Select and copy the **Deployment ID** value.
1.  Close the dialog and the **Deployments** window.

Then configure the Hangouts Chat API to create your bot:

1.  Back in the Google Cloud Developers Console, open the
    [**Hangouts Chat API**][library_chat] page in the API library and click the
    **ENABLE** button.
1.  Once the API is enabled, on click the **Configuration** tab.
1.  In the Configuration tab, do the following:
    1.  In the **Bot name** box, enter "Attendance Bot".
    1.  In the **Avatar URL box**, enter `https://goo.gl/kv2ENA`.
    1.  In the **Description box**, enter "Call in sick with a bot".
    1.  Under **Functionality**, select **Bot works in direct messages**.
    1.  Under **Connection settings**, select **Apps Script project** and paste
        your script's **Deployment ID** into the text box.
    1.  Under **Permissions**, select **Specific people and group in your
        domain**. In the text box under the drop-down menu, enter your email
        address.
    1.  Click Save changes.
1.  After you save your changes, verify that the status on the Hangouts Chat API
    page shows the Bot Status to be **LIVE – available to users**.

[library_chat]: https://console.cloud.google.com/apis/library/chat.googleapis.com

Finally, test that your bot is working:

1.  Open [Hangouts Chat][hangouts_chat].
1.  Click **Find people, rooms, bots > Message a bot**.
1.  From the list, select the **Attendance Bot** that you created.
1.  Send the message "I'm sick" to the bot.
1.  Click the **CONFIGURE** button and authorize access to your account.
1.  In the resulting card, click the **SET VACATION IN GMAIL** and
    **BLOCK OUT DAY IN CALENDAR** buttons.

[hangouts_chat]: https://chat.google.com

## Next steps

To learn more about how the bot was made, follow [this codelab][codelab] for
detailed instructions on each step in the process. You can also view the
[full source code][github] of this solution on GitHub if you want to jump right
to the end.

[codelab]: https://codelabs.developers.google.com/codelabs/chat-apps-script/
[github]: https://github.com/googlecodelabs/hangouts-chat-apps-script
