# Send content automatically

*From a list of topics, let users receive content specific to their interests.*

Last updated: August, 2019

## Description

By using a Google Form, let users select topics from a predefined list,
and store the submissions in a Google Sheet.
Using the `onFormSubmit` installable trigger, we can send a customized email
as soon as a user clicks the **Submit** button on the Google Form.
A Google Doc is used as the email template, which inserts custom names and
links to online content such as videos, whitepapers, blogs, PDF summaries,
or other resources.

A Google Form can be accessed on your website, email signature,
instant message, or wherever you share the form's link.

## Setup

1. First, make a copy of this Google Sheet
   [by clicking this link](https://docs.google.com/spreadsheets/d/1T8EmWrxpsOxSJPUo37Lkf6S8GRP3tz9b0zUL2-_Z644/copy)
   in your browser. It will automatically include a Google Form and the code
   you will need called an Apps Script.

   > *Note:* The spreadsheet contains 5 columns. Please note to *not change
   > the order of the questions* in the form or remove nor rename any of the
   > columns in the sheet as the *script's execution* depends on this order.

1. *[optional]* Rename the topics for the 3rd form question called:

   **Topics I would like to learn about**

   > *Caution:* When *renaming* the topics in the form,  ensure you rename
   > them exactly the same in the code.

1. Now return to the *Google Form* > click the **top 3 dots** > select
**"Preview."** This will bring you to the live form that people will see when
 you share it with them. *Fill out* all the fields and *ensure* to use an 
 *email address* you have access to.

## Run the script

1. Since you submitted a form response in an earlier step, visit your 
Spreadsheet and dive into the code by clicking on **Tools > Script Editor**
in your Google Sheet.

1. This will bring you to the *Apps Script editor.*

1. *[optional]* if you *changed* any of the *topic names* in your *form*,
paste the exact *topic names* in the code of the script starting around 
**line 18.**

1. Let's now *run the script* by clicking the **"Select function"** drop down >
choose **"onForm Submit."** Then click the **run icon** (which looks like a
play button). This will create a trigger for you automatically which you can
visit at https://script.google.com/home at a later time.

1. You will be promoted to review permissions to allow the code to email on
your behalf.

   > *Important:* if you get a warning that the app is not secure because it
   > is not verified, simply click the link that shows **"advanced options"**
   > and follow through > the steps to *continue visiting this site.*

1. After granting permissions, the script will run and the **Sent Date** column
 in your spreadsheet will begin to have time stamps confirming the time an 
 email was sent if topics were selected in the form by a user.

   > *Note:* if no topics are selected in the Google Form, the code is meant
   > to *not send an email.*

1. Finally to *check* the *script worked,* login to the email account you
provided in your form entry and see if you received an email with the subject
line: *"Howdy."*

1. *[optional]* The email sent out comes from a Google Doc template already
setup. However, if you wish to customize that template, you can make your 
own copy by *[clicking this link](https://docs.google.com/document/d/1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE/copy).* and then copy its 
**unique ID** which can be found in its **URL address** in the *browser* by
copying the *number/letter* combo after `https://docs.google.com/document/d/`
and before `/edit#` which will look like this: 
`1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE` and replacing the Google Doc ID
in the code on **line 3**. You must set this template's sharing rights to
*"viewed by anyone with this link"* or at least *"viewed by anyone with this
link on my organization."*

   > Caution: Remember to *not delete* the items *in brackets* in the Google
   > Doc as these are *placeholders* for the *script to populate* with custom
   > information from the form such as `{{NAME}}` and `{{TOPICS}}.` These
   > *cannot be removed* but you can change their color and size.

1. *[optional]* If you wish to change the subject line of your email,
replace the text `Howdy` on **line 71** to your preferred text *within* the
backtick marks.
