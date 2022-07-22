---
title: Send follow-up emails automatically
description: Send users in an online community follow up content based on their interests.
labels: Apps Script, Gmail, Forms, Docs
material_icon: autorenew
create_time: 2019-07-15
update_time: 2019-09-17
---

Contributed by Tech and Eco, follow me on [Twitter](https://twitter.com/TechandEco)

By using a Google Form, let users select topics from a predefined list of
content that you offer, and store the submissions in a Google Sheet. The
content is then automatically sent to their email using a Google Doc as the
email's template. The template inserts the user's name and the online content
they selected which can be a video, whitepaper, blog, PDF summary, or other
resources referenced via a URL.

The Google Form can be accessed on your website, email signature,
instant message, or wherever you share the form's link.

![Topics are selected in a form, and upon submit an email is sent](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/content-signup/demo.gif)

## Technology highlights

- Using the `onFormSubmit` installable trigger, you can send a customized email
  as soon as a user clicks the **Submit** button on the Google Form. To see
  more of the `onFormSubmit` event, see the
  [Event Objects](https://developers.google.com/apps-script/guides/triggers/events#form-submit)
  page.

## Try it

[![Learn more about this solution](https://img.youtube.com/vi/xxgQr-jSu9o/0.jpg)](https://www.youtube.com/embed/xxgQr-jSu9o)

1. Make a copy of this Google Sheet
   [by clicking this link](https://docs.google.com/spreadsheets/d/1vyv-QcQ0wgaGNV7XklZI1jq95Cg_QVBq-o4rhTJqg00/copy)
   in your browser. It automatically includes a Google Form and the code
   you need.

1. From your spreadsheet click on **Extensions** <span aria-label="and then">></span> **Apps Script**. This brings
   you to the _Apps Script editor._

1. Now _run the script_ by clicking the **Select function** drop down >
   choose **"installTrigger."** Then click the Run button (►). This installs
   a trigger in your project that runs the code everytime a new form
   entry is submitted.

   > _Caution_: If you run this script more than once, it generates
   > _multiple triggers_ which would duplicate emails. Ensure you only run the
   > script once and that there aren't multiple triggers on the triggers page.
   > You can optionally visit the triggers page by clicking on the
   > _trigger icon_ (which looks like a clock) to confirm there is only one.

1. When prompted, click **Review permissions** and **Allow**
   so the script can send email on your behalf.

   > *Important:* If you get a warning that **This app isn't verified**
   > continue with the verification process by clicking
   > **Advanced** and then scroll down and click the grey text at the bottom
   > that says **Go to (Copy this) Script to send content**

1. After granting permissions, return to your spreadsheet and locate **Form** >
   **Go to live form.** This brings you to the Google form that people
   see when you share its link. _Fill out_ all the fields and _ensure_ to use
   an _email address_ you have access to, and click **Submit**.

   > _Note_: if no topics are selected in the Google Form, the code
   > _will not send an email_.

1. Return to your spreadsheet, you should have a row of values entered based
   on your form submission. One of the columns called **Confirmation**
   say **Sent**, confirming that the topics you selected in the form were
   emailed.

   > _Note_: if you do not see the form responses in your sheet, you need
   > to unlink and relink your form to it. From your sheet click **Form >
   > Unlink Form** then visit your form in edit mode and in the _responses_
   > section click **Select response destination > Select existing
   > spreadsheet** , and choose _your spreadsheet_ as the source. This creates
   > a new sheet called **Form Responses 2**. You can _delete_ the tab
   > **Form Responses 1** so you only have one active sheet.

1. Finally, login to the email account you provided in your form entry and
   see if you received an email with the subject line: **"Howdy"** along with
   links to the topics you selected.

## Customize your script

1. *[optional]*
   The email sent out comes from a Google Doc template already setup.
   However, if you wish to customize that template,
   you can make your own copy by
   [clicking this link](https://docs.google.com/document/d/1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE/copy) and set permissions to
   viewable by _anyone_ unless your audience are people within your
   organization, set to _anyone in your organization_. Then copy its
   _URL address_ from the _browser_ and replace the URL in the
   `EMAIL_TEMPLATE_DOC_URL` variable in the script's code.

   > _Note_: `{{NAME}}` and `{{TOPICS}}` in the Google Doc are placeholders
   > that insert the name and the content links from the topics selected
   > by the user upon them submitting the form.

1. _[optional]_ If you wish to change the subject line of your email,
   replace the text in the `EMAIL_SUBJECT` variable in the script's code.

1. *[optional]* If you wish to rename the topics in the form, upon changing
   them, also paste the new topic names into the `topicUrls` variable in the
   script's code.

   > *Caution:* When *renaming* the topics in the form,  ensure you paste
   > the exact *topic names* in the code as well. Ensure the word is
   > contained in the form's choices.
   > Ex: if you rename “(NUTRITION) Raw vegan recipes” to
   > “(MINDFULNESS) Learning how to meditate in a busy world” in the form,
   > make sure to go back the `topicUrls` variable and replace “Nutrition” with
   > “Mindfulness” + _the link you want people to receive_

## Next steps

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro
[github]: https://github.com/googleworkspace/solutions/blob/main/content-signup
