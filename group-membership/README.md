---
title: Give external users access to resources
description: Scale access to external vendors and customers via a Google Sheet 
and a Google Group.
labels: Apps Script, Sheets, Groups for Business
material_icon: assignment turned in
create_time: 2019-08-30
update_time: 2019-09-17
---

Contributed by Tech and Eco, follow me on
[Twitter](https://twitter.com/TechandEco)!

You may manage multiple Google Groups for your organization and wish to
streamline this process, especially if you have to manually send an email upon
granting users membership. The following Google Spreadsheet contains a script
that helps add the email address of a user to a G Suite Google Group,
and then sends them an email confirming they have been added.

## Technology highlights

* Using the `onEdit` _simple trigger_ in a Google Sheet, you can grant access
  to multiple resources from a spreadsheet.
  To learn more [click here](https://developers.google.com/apps-script/guides/triggers/#onedite)
* Manage group members using the
  [Admin Directory](https://developers.google.com/admin-sdk/directory/v1/guides/manage-group-members)
* A _Google Document_ is used as the email's _template_.

## Try it

1. Make a [copy of this Google Spreadsheet](https://docs.google.com/spreadsheets/d/1kNuOc_evfqbu8dVJIA5N4r27d_Ubnr915eln4cbq2cU/copy) from your G Suite account.
1. From your spreadsheet, click on **Tools > Script Editor**. This will bring
   you to the _Apps Script editor_.
1. Ensure the **Admin Directory API** is enabled via
   **Resources > Advanced Google Services**.
1. Now run the script by clicking the **Select function** drop down > choose            **"installTrigger."** Then click the Run button (►). This will create a
   trigger for your sheet automatically.

    > _Caution_: If you run this script _more than once_, it will generate
    > _multiple triggers_ causing duplicate emails. Ensure you run the script
    > once and that there aren't multiple triggers on the triggers page.
    > You can visit the triggers page by clicking the _trigger icon_ (which
    > looks like a clock from the script's page.

1. When prompted, click the **Review permissions** and click **Allow** so the
   script can email on your behalf.

   > _Important_: If you get the warning **This app isn't verified**, continue
   > with the verification process by clicking **Advanced** and then scroll
   > down and click the grey text at the bottom that says
   > **Go to (Copy this external-access to a Google Group via onEdit Sheet**

1. After granting permissions, return to your spreadsheet and _type an email
   address_ in the `Email` column and the _group address_ in the `Google Group`
   column, and the word `yes` in the `Allowed` column.

   > _Note_: if you do not populate the column `allowed` with the word `yes`,
   > the script is instructed to _not run_. This is helpful if you wish to
   > capture requests to join a group in the sheet but not add them the users
   > yet until you populate the **allowed** column.

1. To _test_, enter _your own email_ and a Google Group that you already
   are a member of and have _manager rights_ to adding members in order to
   receive the confirmation email.

## Optionally customize your email template

1. _[optional]_ You can modify the font, color, and images of your email
   template by [making a copy of this doc](https://docs.google.com/document/d/1-ajkkIP8gUWqMcnpXhkqwlM_2Y18USLdJ-pFZdDEZ70/copy). Then copy its
   URL address and replace the one listed in the vairable `addedToGroupDocId`
   in the sheet's script.

   > _Note_: `{{EMAIL}}` and `{{GOOGLE_GROUP}}` are placeholders in your
   > template that insert the values from the Google Sheet. In order for
   > external users to receive the template's format, the Google doc's
   > permissions must be set to **Viewable by anyone with this link**; and at
   > least **Viewable by anyone in your organization** to share with anyone 
   > in your domain.

1. _[optional]_ To modify the _subject line_ of the confirmation email, enter
   the desired message in the variable `addedToGroupSubject` in the sheet's
   script.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/gsuitedevs/solutions/blob/master/group-membership
