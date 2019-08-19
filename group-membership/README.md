# Give external users access to resources

*Scale access to external vendors and customers via a Google Sheet and an Apps
Script in G Suite.*

## Description

You may manage multiple Google Groups for your organization and wish to streamline this process, especially if you have to manually send an email upon granting users membership. The following Google Spreadsheet contains a script that helps add the email address of a user to a Google Group, and then sends them an email confirming they have been added.

## Technology highlights

* Using the `onEdit` *simple trigger* in a *Google Sheet*, you can grant access to multiple resources from a spreadsheet.
* *Google Group permissions* are respected.
* A *Google Document* is used as the email's *template*.

## Try it

1. Make a [copy of this Google Spreadsheet](https://docs.google.com/spreadsheets/d/1kNuOc_evfqbu8dVJIA5N4r27d_Ubnr915eln4cbq2cU/copy) from your G Suite account.
1. From your spreadsheet, click on **Tools > Script Editor**. This will bring you to the *Apps Script editor*.
1. Ensure the **Admin Directory API** is enabled via **Resources > Advanced Google Services**.
1. Now run the script by clicking the **"Select function"** drop down > choose **"installTrigger."** Then click the Run button (►). This will create a trigger for your sheet automatically which you can visit on the triggers page by clicking the **trigger icon** (which looks like a clock).

    > *Caution:* If you run this script *more than once*, it will generate *multiple triggers* which would duplicate emails. Ensure you run the script once and that there aren't multiple triggers on the triggers page.
1. When prompted, click the **Review permissions** and click **Allow** so the script can email on your behalf.

   > *Important:* If you get the warning **This app isn't verified**, continue with the verification process by clicking **Advanced** and then scroll down and click the grey text at the bottom that says **Go to (Copy this) external-access to a Google Group via onEdit Sheet**
1. After granting permissions, return to your spreadsheet and *type an email address* in the `Email` column and the *group address* in the `Google Group` column, and the word `yes` in the `Allowed` column.

   > Note if you do not populate the column `allowed` with the word `yes`, the script is instructed to not run. This is helpful if you wish to capture requests but not process them yet until you populate the *allowed* column. 

1. To *test*, enter *your own email* and a *Google Group* you already are a *member* of and have *manager rights* to its membership in order to *receive* the *confirmation* email.

## Optionally customize your email template

1. *[optional]* You can modify the font, color, and images of your email template by [making a copy of this doc](https://docs.google.com/document/d/1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70/copy). Then copy its unique ID within its URL address (it's a string of text after https://docs.google.com/document/d/ and before `/edit#`  which will look like this: `1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70`). Then replace the Google Doc ID in the spreadsheet's code, starting on **line 11**. You must set this template's *sharing rights* to **Viewable by anyone with this link** or at least **Viewable by anyone in your organization**.

   > *Caution*: Remember to *not delete* the items in brackets within the *Google Doc* as these are *placeholders* for the script to populate with *custom information* from the sheet such as `{{EMAIL}}` and `{{GOOGLE_GROUP}}`.

1. [optional] Modify the *subject line* of the confirmation email in the sheet's code on **line 10** by replacing `Added to group` to the text you desire.