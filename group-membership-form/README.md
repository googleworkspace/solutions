# Automate access to new team members

*Set new hires up for success with the resources they need.*

Last updated: August 2019

## Description

It’s hard to give incoming peers a consistently good experience when joining the team because of how error prone giving access to resources can sometimes be. This solution contains a Google Sheet with a Google Form to help automate a bit of this usually manual task.

## Technology highlights

* Using the **onFormSubmit** installable trigger in a Google Sheet, you can
  grant access to resources by clicking the **Submit** button in a Google Form.
* Leverage Google Groups permission roles.
* Use a Google Document as the email templates.

## Try it

1. Make a [copy of this Google Spreadsheet](https://docs.google.com/spreadsheets/d/1MH_cyvP_0DVTsQ0A606Tx3vuQU_2kjpbDCs_AhRH1lA/copy) from your *G Suite* account.
1. From your spreadsheet, click on **Tools > Script Editor**.
   This will bring you to the Apps Script editor.
1. Ensure the *Admin Directory API* is enabled via
   **Resources > Advanced Google Services**.
1. Now *run the script* by clicking the **"Select function"** drop down >
   choose **"installTrigger."** Then click the Run button (►).
   This will create a trigger for your sheet automatically which you can visit
   on the triggers page  by clicking the **trigger icon** (which looks like a
   clock).

   > Caution: If you run this script more than once, it will generate
   > *multiple triggers* which would duplicate emails. Ensure you only run the
   > script once and that there aren't multiple triggers on the triggers page.
1. When prompted, click the **Review permissions** and click **Allow** so the
   script can email on your behalf.
   > Important: If you get a warning that **This app isn't verified** continue
   > with the verification process by clicking **Advanced** and then scroll
   > down and click the grey text at the bottom that says
   > **Go to (Copy this) OnFormSubmit internal-access (Groups via onFormSubmit Sheet)**
1. After granting permissions, return to your spreadsheet and locate **Form > Go to live form**. This will bring you to the Google form that people in your organization can fill out on a *new team member's* behalf. This helpa distribute the efforts of giving access across the team. 
   > Important: while trying this script, enter a Google Group you have rights to manage its membership.

1. To *test*, enter *your own email* and a Google Group *you already are
   a member of* in the Google Form in order to receive an mail.

## Optionally customize your script

1. *[optional]* Add *custom fields* to the form. For example, you may want
   to record who on the team helps new members the most by adding a
   **Requestor field**, which will create an additional column in your sheet.
2. *[optional]* Enable notifications in the Google Form in the **Responses**
   section **> 3 dots > Get email notifications for new responses** if you
   wish to get notified everytime someone submits a new request.
3. *[optional]* You can *modify* the font, color, and pictures of
   *your email template* by making a copy of
   [this Google Doc](https://docs.google.com/document/d/11AO7vwk6179ohuxGO_NXSoDB0m_H5e-5XEtwiWRVNOM/copy).
   Then copy its unique ID which can be found in the URL address in the browser
   by grabbing the *number/letter* combo string after
   `https://docs.google.com/document/d/` and before `/edit#`
   which will look like this: `HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE`.
   Replace the Google Doc ID in the code starting on **line 10**. You must
   set this template's sharing rights to **viewable by Anyone with this link**
   or at least **viewable by anyone in your organization**.

   > Caution: Remember to *not delete* the items *in brackets* in your Google
   > Doc template as these are *placeholders* for the script to populate with
   > custom information from the form such as `{{EMAIL}}` and `{{GOOGLE_GROUP}}`.
   > These *cannot be removed* but you can change their color and size.
