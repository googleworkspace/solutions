---
title: Create a mail merge using Gmail and Google Sheets
description: Create and distribute visually rich mail merges with Gmail and Google Sheets.
labels: Sheets, Gmail
material_icon: merge_type
create_time: 2019-09-13
update_time: 2019-09-13
---

Contributed by Martin Hawksey, follow me on Twitter [@mhawksey](https://twitter.com/mhawksey) or [read my Google Apps Script related blog posts](https://mashe.hawksey.info/category/google-apps-script/).

Simplify the process of producing visually rich mail merges using Gmail and combining it with data from Google Sheets. With this solution you can automatically populate an email template created as a Gmail draft with data from Google Sheets. Merged emails are sent from your Gmail account allowing you to respond to recipient replies.

![Mail merge with Gmail and Google Sheets](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/mail-merge/mailmerge.gif)

## Technology highlights

* Uses the [Gmail Service](https://developers.google.com/apps-script/reference/gmail/) to read drafts and to send emails.

* Uses  [SpreadsheetApp service](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app) to read and write data.

## Try it

1. Create a copy of the sample [Gmail/Sheets Mail Merge spreadsheet](https://docs.google.com/spreadsheets/d/1EfjLuYGab8Xt8wCn4IokBIG0_W4tBtiU4vxl3Y7FPsA/copy).

2. Update the **Recipients** column with email addresses you would like to use in the mail merge

3. Create a draft message in your Gmail account using markers like `{{First name}}`, which correspond to column names, to indicate text you’d like to be replaced with data from the copied spreadsheet. 

4. In the copied spreadsheet, click on custom menu item **Mail Merge > Send Emails**.

5. A dialog box will appear and tell you that the script requires authorization. Read the authorization notice and continue.

6. When prompted enter or copy/paste the subject line used in your draft Gmail message and click **OK**

7. The **Email Sent** column will update with the message status.

## Next steps

Additional columns can be added to the spreadsheet with other data you would like to use. Using the `{{}}` annotation and including your column name as part of your Gmail draft will allow you to include other data from your spreadsheet. If you change the name of the **Recipient** or **Email Sent** columns this will need to be updated by opening **Tools > Script Editor**.

For more information on the number of email recipients that can be contacted per day you can read the [Current Quotas documentation](https://developers.google.com/apps-script/guides/services/quotas#current_quotas). If you would like to find out more about the coding pattern used to conditionally read and write Google Sheets data [here is a related blog post](https://mashe.hawksey.info/2018/02/google-apps-script-patterns-conditionally-updating-rows-of-google-sheet-data-by-reading-and-writing-data-once/). 

To learn more about Google Apps Script, try out [the codelab](https://codelabs.developers.google.com/codelabs/apps-script-intro) which guides you through the creation of your first script.

You can also view the [full source code](https://github.com/gsuitedevs/solutions/blob/master/mail-merge) of this solution on GitHub to learn more about how it was built.
