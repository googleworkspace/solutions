# Create expense reports directly from email receipts

_Allow your employees to directly import expense report information from their email._

Last updated: July, 2019

## Description

Simplify how your employees do expense reporting with a Gmail Add-on and Google Sheets. Anytime a
user receives an email receipt, they can open the add-on which automatically contains relevant 
information about the expense. Users can edit that information and then submit the form to log 
their expense into a spreadsheet.

![demo][demo]
[demo]: https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/expenses-add-on/expenseit.gif

## Technology highlights

- Use the [Card Service][cardservice] for Gmail add-ons to build a UI to works both on web and
mobile. 
- Store user values using Google Apps Script's [Properties Service][propertiesservice].

[cardservice]: https://developers.google.com/apps-script/reference/card-service/
[propertiesservice]:https://developers.google.com/apps-script/reference/properties/

## Try it

1. Create a copy of the Gmail Add-on code by clicking this [link][code]. This will create a new 
script in your G Suite Developer Hub where you can manage your Apps Script projects. 
1. Select View > Show manifest file, which opens a file titled `appsscript.json`.
1. Select Publish > Deploy from manifest.
1. Next to the entry Latest Version (Head) Click Get ID.
1. Select and copy the Deployment ID value.
1. Close the dialog and the Deployments window.
1. Open the [Gmail add-on settings][settings] tab.
1. In the Add-ons tab, ensure that you have selected the Enable developer add-ons for my account checkbox.
1. Paste your add-on's deployment ID into the Developer add-ons textbox and click Install.
1. In the Install developer add-on dialog that appears, click the checkbox to
indicate that you trust this developer (yourself), then click Install.
1. Open any message in Gmail, either on web or mobile.
1. A new button that resembles a receipt ![icon] should appear on the right or bottom of your screen, depending on your platform.
1. Click the button to authorize the add-on and follow the prompts.
1. Open an email and fill out the receipt information and click `New Sheet`.
1. Open your Google Drive to view the new expense report. 

[code]: https://script.google.com/d/12PB96o6hZfb5NKBSFJQ2dOtzfMnr-nRPCOnRUyfFbdmeR23qFQILF67q/copy
[settings]: https://mail.google.com/mail/u/0/#settings/addons
[icon]: https://cdn.jsdelivr.net/gh/gsuitedevs/solutions@master/expenses-add-on/receipt-icon.png

## Next steps

To learn more about making this add-on, follow [this codelab][codelab] for detailed instructions on
each step.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[codelab]: https://codelabs.developers.google.com/codelabs/gmail-add-ons/
[github]: https://github.com/googlecodelabs/gmail-add-ons/tree/master/Full-application
