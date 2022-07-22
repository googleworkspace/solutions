---
title: Create expense reports directly from email receipts
description: Allows employees to move information from email receipts into their spreadsheet expense reports without copying and pasting.
labels: Apps Script, Sheets, Gmail
material_icon: receipt
create_time: 2019-07-31
update_time: 2019-08-12
---

Simplify how your employees do expense reporting with a Gmail Add-on and Google Sheets. Anytime a
user receives an email receipt, they can open the add-on which automatically contains relevant
information about the expense. Users can edit that information and then submit the form to log
their expense into a spreadsheet.

![demo](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/expenses-add-on/expenseit.gif)

## Technology highlights

- Use the [Card Service][cardservice] for Gmail add-ons to build a UI to works both on web and
mobile.
- Store user values using Google Apps Script's [Properties Service][propertiesservice].

[cardservice]: https://developers.google.com/apps-script/reference/card-service/
[propertiesservice]:https://developers.google.com/apps-script/reference/properties/

## Try it

[![Learn more about this solution](https://img.youtube.com/vi/1vxIyNWczJo/0.jpg)](https://www.youtube.com/watch?v=1vxIyNWczJo&list=PLU8ezI8GYqs4YntFNP9jf_rrZ0vJLSW2X&index=6)

First, create the script:

1.  [Click here][code] to open the bot code in the Apps Script code editor.
1.  Click the menu item **File > Make a copy** to get your own copy. You can
    later access this copy in the [Google Workspace Developer Hub][hub].

Next, deploy the add-on:

1. Select **Publish** > **Deploy from manifest**.
1. Next to the entry **Latest Version (Head)** click **Install add-on**.

Test it out and create a new expense report:

1. Open any message in Gmail, either on web or mobile.
1. A new button that resembles a receipt ![icon](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/expenses-add-on/receipt-icon.png)
should appear on the right or bottom of your screen, depending on your platform.
1. Click the button to authorize the add-on and follow the prompts.
1. Open an email and fill out the receipt information and click **New Sheet**.
1. Open your Google Drive to view the new expense report.

[code]: https://script.google.com/d/12PB96o6hZfb5NKBSFJQ2dOtzfMnr-nRPCOnRUyfFbdmeR23qFQILF67q/edit
[hub]: https://script.google.com
[settings]: https://mail.google.com/mail/u/0/#settings/addons

## Next steps

To learn more about making this add-on, follow [this codelab][codelab] for detailed instructions on
each step.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/gmail-add-ons/
[github]: https://github.com/googlecodelabs/gmail-add-ons/tree/master/Full-application
