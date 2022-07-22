---
title: Offer a one stop shop onboarding experience
description: Set new hires up for success with the resources they need.
labels:  Sheets, Forms, Groups for Business, Apps Script
material_icon: settings_input_component
create_time: 2019-08-30
update_time: 2019-09-17
---
Contributed by Tech and Eco, follow me on
[Twitter](https://twitter.com/TechandEco)!

It’s hard to give incoming peers a consistently good experience when joining
the team because of how error prone giving access to different resources can
sometimes be. By using a Google Group, and sharing resources with that group's
address, it makes it easy to help new hires get access to what they need to be
productive in one step.

If you have permissions to add users to a group, you
can use this script to distribute the responsibility to other members of your
team to fill out the form as you, and have the new person's email added to
the group, and be granted access to the resources the group is permitted.

For larger teams, you can optionally enable notficiations in the spreadsheet
to receive an email everytime a new form submission occurs.

![Topics are selected in a form, and upon submit an email is sent](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/group-membership-form/demo.gif)

## Technology highlights

- The _onFormSubmit_ installable trigger is used to run the script upon
  a user submitting an entry in a Google Form. To learn more visit
  [this page](https://developers.google.com/apps-script/reference/script/form-trigger-builder#onFormSubmit())
- Add members to a _Google Group for Business_ using the
  [Admin Directory API](https://developers.google.com/apps-script/advanced/admin-sdk-directory)
- Use a Google Document as an email template.

## Try it

1. Make a [copy of this Google Spreadsheet](https://docs.google.com/spreadsheets/d/1MH_cyvP_0DVTsQ0A606Tx3vuQU_2kjpbDCs_AhRH1lA/copy) from your _Google Workspace_ account.
1. From your spreadsheet, click on **Extensions** <span aria-label="and then">></span> **Apps Script**.
1. Ensure the _Admin Directory API_ is enabled via
   **Resources > Advanced Google Services**.
1. Now _run the script_ by clicking the **"Select function"** drop down >
   choose **"installTrigger."** Then click the Run button (►).
   This will create a trigger for your sheet automatically.

   > Caution: If you run this script more than once, it will generate
   > _multiple triggers_ which would duplicate emails. You can visit the
   > triggers page by clicking on the _trigger icon_ (which looks like a
   > clock).

1. When prompted, click the **Review permissions** and click **Allow** so the
   script can email on your behalf.

   > _Note_: If you get a warning that **This app isn't verified** continue
   > with the verification process by clicking **Advanced** and then scroll
   > down and click the grey text at the bottom that begins with **Go to...**

1. After granting permissions, return to your spreadsheet and locate
   **Form > Go to live form**.
1. Fill out the form and enter *your own email* and a Google Group you have
   rights to manage its membership in order to receive an email.
   The membership status will be populated by the words **Newly added** if the
   user was added to the group, or **Already added** if it recognizes the user
   is already a member.
   > _Note_: if you do not see the form responses in your sheet, you need to
   > unlink and relink your form to it. From your sheet click
   > **Form > Unlink Form**. Then visit your form in edit mode and in the
   > responses section click select
   > **response destination > Select existing spreadsheet**, and choose
   > your spreadsheet as the source. This creates a new sheet called
   > **Form Responses 2**. You can delete the tab **Form Responses 1**
   > so you only have one active sheet.

## _[optional]_ Customize your script

- Add _custom fields_ to the form. For example, you may want
  to record who on the team helps new members the most by adding a
  **Requestor name** field, which will create an additional column in your
  sheet.

- Enable notifications in the Google Form in the
  **Responses** section **> 3 dots > Get email notifications for new responses**
  if you wish to get notified everytime someone submits a new request.

- If you wish to change the subject lines of your emails, replace
  the text in the variables `ADDED_TO_GROUP_SUBJECT` and
  `ALREADY_IN_GROUP_SUBJECT` at the top of the script.

- You can _modify_ the font, color, and pictures of
  _your email templates_ by making a copy of both
  [Added to a group](https://docs.google.com/document/d/1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70/edit?usp=sharing) and [Already in a group](https://docs.google.com/document/d/11AO7vwk6179ohuxGO_NXSoDB0m_H5e-5XEtwiWRVNOM/edit?usp=sharing)
  > _Note_: set the documents permissions to _Anyone_ in your organization with
  > the link can view it.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/group-membership-form
