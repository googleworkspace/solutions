---
title: Automatically Create Draft Gmail Replies To Form Responses
description: Use Apps Script to quickly create draft email replies to Google Form Responses.
labels: Apps Script, Sheets, Forms, Gmail
material_icon: email
create_time: 2019-09-26
update_time: 2019-09-26
---

# Automatically Create Draft Gmail Replies To Form Responses

_Create draft replies to your product survey in Gmail, including feedback._

Contributed by Ben Collins, find me at [benlcollins.com][benlcollins-link]

Quickly respond to large volumes of Form Responses by having Apps Script generate draft email replies ready for sending. The draft replies include the form responses, which can be reviewed inside the email. A generic thank you message is created and additional personal feedback can be added before hitting send.

![Generate draft Gmail replies to Google Form Responses automatically][solution-gif]

## Technology highlights

- A [Custom Menu][custommenu-docs] is used to create a trigger on form submits that creates draft emails.
- The [`GmailApp` service][gmailapp-docs] is used to create draft emails.

## Try it

1. Create a [copy of the sample][sample-sheet-url]
1. Click on **Enable auto draft replies** under the **Form Reply Tool** custom menu
1. Grant permissions to the script by following the prompts
1. Open the form from the **Form** then **Go to live form** menu
1. Submit a form
1. Check your draft folder of Gmail to view the draft email
1. Review the form feedback in the draft email and add any additional comments
1. Send!

## Next steps

Share the form to accept form responses from others.

Modify the questions in your Google Form to suit your business need.

Modify the HTML code in the `createEmailBody` function to match the questions in your Google Form.

_This solution is based on this [original solution][article-benlcollins]_

To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

[benlcollins-link]: https://www.benlcollins.com
[solution-gif]: https://www.benlcollins.com/wp-content/uploads/2019/09/autoDraftReplies.gif
[gmailapp-docs]: https://developers.google.com/apps-script/reference/gmail
[custommenu-docs]: https://developers.google.com/apps-script/guides/menus
[sample-sheet-url]: https://docs.google.com/spreadsheets/d/1rObN-HNAqrbLVEnecrtt2BOZAfcAbXrDmGSktfvY_eI/edit?usp=sharing
[article-benlcollins]: https://www.benlcollins.com/spreadsheets/google-forms-survey-tool/
[codelab]: https://codelabs.developers.google.com/codelabs/apps-script-intro