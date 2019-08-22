# Send content automatically

*From a list of topics, let users receive content specific to their interests.*

Last updated: August, 2019

## Description

By using a Google Form, let users select topics from a predefined list,
and store the submissions in a Google Sheet.

## Technology highlights

- Using the `onFormSubmit` installable trigger, you can send a customized email
as soon as a user clicks the **Submit** button on the Google Form.
- A Google Doc is used as the email template, which inserts custom names and
links to online content such as videos, whitepapers, blogs, PDF summaries,
or other resources.
- A Google Form can be accessed on your website, email signature,
instant message, or wherever you share the form's link.

![Topics are selected in a form, and upon submit an email is sent](https://github.com/gsuitedevs/solutions/raw/master/content-signup/assets/content-signup.gif)

## Try it

1. Make a copy of this Google Sheet
   [by clicking this link](https://docs.google.com/spreadsheets/d/14V2cLGRXB_iaiQWXsTwapPPZ0hMj3fTjpD_hfhAiGqI/copy)
   in your browser. It will automatically include a Google Form and the code
   you will need.

1. From your spreadsheet click on **Tools > Script Editor**.

1. This will bring you to the *Apps Script editor.*
   Now *run the script* by clicking the **Select function** drop down >
   choose **"installTrigger."** Then click the Run button (►). This will
   install a trigger in your project that runs the code everytime a new form
   entry is submitted.
   You can optionally visit the newly installed trigger by clicking
   the *trigger icon* (which looks like a clock).

   > *Caution*: If you run this script more than once, it will generate *multiple
   > triggers* which would duplicate emails. Ensure you only run the script once
   > and that there aren't multiple triggers on the triggers page.

1. When prompted, click the **Review permissions** and click **Allow** button
   so the script can email on your behalf.

   > *Important:* If you get a warning that **This app isn't verified**
   > continue with the verification process by clicking
   > **Advanced** and then scroll down and click the grey text at the bottom
   > that says **Go to (Copy this) Script to send content**

1. After granting permissions, return to your spreadsheet and locate **Form** >
**Go to live form.** This will bring you to the Google form that people will
see when you share its link. *Fill out* all the fields and *ensure* to use an
*email address* you have access to, and click **Submit**.

   > *Note:* if no topics are selected in the Google Form, the code will
   > *will not send an email*. Ensure to select a topic in order to receive an
   > email.

1. Return to your spreadsheet, you should have a row of values entered based
on your form submission. One of the columns called **Confirmation** will
say **Sent**, confirming that the topics you selected in the form were emailed.

1. Finally, login to the email account you
provided in your form entry and see if you received an email with the subject
line: **"Howdy"** along with links to the topics you selected.

## Customize your script

1. *[optional]* The email sent out comes from a Google Doc template already
setup. However, if you wish to customize that template, you can make your 
own copy by [clicking this link](https://docs.google.com/document/d/1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE/copy). and then copy its
*unique ID* which can be found in its *URL address* in the *browser* by
copying the *number/letter* combo after `https://docs.google.com/document/d/`
and before `/edit#` which will look like this: 
`1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE` and replace the Google Doc ID
in the code on **line 3**. You must set this template's sharing rights to
viewed by **Anyone with this link** or at least *viewable by anyone in your
organization.*

   > *Caution:* Remember to *not delete* the items *in brackets* in the Google
   > Doc as these are *placeholders* for the *script to populate* with custom
   > information from the form such as `{{NAME}}` and `{{TOPICS}}.` These
   > *cannot be removed* but you can change their color and size.

1. *[optional]* If you wish to change the subject line of your email,
replace the text `Howdy` on **line 4** to your preferred text *within* the
backtick marks.

1. *[optional]* If you wish to rename the topics in the form, upon changing them, also paste the new topic names into the spreadsheets code starting on **line 8.**
   > *Caution:* When *renaming* the topics in the form,  ensure you paste
   > the exact *topics names* in the code as well.
   > You do not need to add the entire description that you add in the form
   > however. Ex: rename topic called “(NUTRITION) Raw vegan recipes” to
   > “(MINDFULNESS) Learning how to meditate in a busy world” in the form,
   > make sure to go back to the code on line 8 and replace “Nutrition” with
   > “Mindfulness” + `the link you want people to receive` within their
   > respective backtick marks.
