---
title: Scale access for external vendors and partners
description: Share documents, events, and communications with users outside
your domain
labels:  Sheets, Groups, Apps Script
material_icon: group_work
create_time: 2019-08-30
update_time: 2020-3-27
---
Contributed by Tech and Eco, follow me on
[Twitter](https://twitter.com/TechandEco)!

Use a Google Group to work cross-functionally with vendors, partners,
customers, and volunteers outside of your domain, and scale access
to work assignments and leverage security controls. You can add an external
user's Google email (this can be their own G Suite account, a G Suite user
account you created for them within your domain, or a free Gmail account) to
your G Suite Google group (not available for consumer Google Groups) via a
Google Sheet to manage users in bulk and keep track of the onboarding history.

Top 6 benefits of this solution:

 1. Adds a new external user to a G Suite Google Group you create
   (example: externalteam@mydomain.com) once, and it allows users to open all
   resources that are shared with that group moving forward (calendar, files,
   training site, dashboards (built on DataStudio), etc.

 1. When adding one or more users to your Google Group, users can receive a
    welcome email with the links they can access.
    [Creating a Google Site](https://sites.google.com/new) is optional but
    recommended to centralize information in a beautiful website interface.

 1. The
    [template of the welcome email](https://docs.google.com/document/d/1GZDh_u9B2ARpYs3Iks8ZouQ_Xlixq076kAst710Z4cg/edit?usp=sharing)
    is composed in a Google Doc, and the script renders it as HTML. You can use
    seperate Google Docs for different recipients to customize messaging.

 1. Capture the email addresses of users in your Sheet, and add them in bulk to
    the desired Google Groups at a later time by changing the column "Allowed"
    to "yes" for each row of users.

 1. You or members of your team, can add users to different Google Groups as
    long as the person who made a copy of this sheet has
    _manager_ or _owner_ rights in each of those Google Groups.

 1. Removing a user from a Group (via the Google Group's interface) will revoke
    their access to all resources. You can also limit documents to be available
    to that group for a
    [specific period of time](https://support.google.com/docs/answer/2494893?co=GENIE.Platform%3DDesktop&hl=en).

![Users are added to a Google Group via a Google Sheet](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/group-membership/demo.gif)

## Technology highlights

- Install a trigger with a click so the script is setup to run everytime the
Sheet is edited. To learn more visit the
 [Apps Script trigger guide](https://developers.google.com/apps-script/guides/triggers/installable))
- Add members to a _Google Group for Business_ using the
 [Admin Directory API](https://developers.google.com/apps-script/advanced/admin-sdk-directory)

## Try it

1. Copy the [External Sustainability Group List](https://docs.google.com/spreadsheets/d/1toqdDkWSAOL7aIElil59RHJH0b1Efebg7GBlgjn3B2Y/edit#gid=0) from your _G Suite_ account.

1. Enter for testing purposes a _Gmail address you own_ and a Google Group you
   have _rights to manage_ its membership. You can learn about
   [group permissions here](https://support.google.com/groups/answer/2464975?hl=en)

   > _Note_: The membership status will be populated by the words
   > **Newly added** if the user was added to the group, or **Already added**
   > if it recognizes the user is already a member of that group.

1. Enter “Yes” in the “Allowed” column.

1. Next, click the custom menu called **Install Trigger** > **onEdit**, this
   will install a trigger that will run everytime a value is changed in the
   sheet.

   ![Install trigger screenshot](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/group-membership/install_trigger.png)

1. When prompted, click the **Review permissions** and click **Allow** so the
   script can email on your behalf.

   > _Note_: If you get a warning that **This app isn't verified** continue
   > with the verification process by clicking **Advanced** and then scroll
   > down and click the grey text at the bottom that begins with **Go to...**

1. Your status field will change.

![Status column is changed](https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/group-membership/final_group_add.gif)

1. Check your inbox to see the email, and then your Google Group’s interface
   to see the new member added.

## _[optional]_ Customize your messaging

- If you wish to change the subject lines of your emails, replace
 the text in the “Email subject” column.

- If you wish to change the
  [email template](https://docs.google.com/document/d/1GZDh_u9B2ARpYs3Iks8ZouQ_Xlixq076kAst710Z4cg/edit#heading=h.uwtpzkmp9874)
  that is sent out, replace the URL in the “Email template” column with your
  preferred Google Doc. If you wish to include any of the column values in the
  template, enter them as such in the template {{Column_name}} like
  this: _Welcome, we have added your {{Email}} to this {{Google_Group}} in
  order give you access to the following resources..._
  > _Note_: If you encounter any issues with the welcome email, change the
  > permission levels of the Google Doc templates to more open settings.

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/gsuitedevs/solutions/blob/master/group-membership
