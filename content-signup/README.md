# Automatically send an email following up with content to people who signup via a form

 You may want to help disperse great content that is accessible as a link such as videos, whitepapers, blogs, PDF summaries, etc based on what people mark as their specific interest in your contact-us form linked on your website, email signature, or wherever you share this form's link.

You can also ask if they would like to subscribe to your mailing list for future content.

(last updated July 31 2019)

## Setup

<!-- [START setup] -->

**First**, set up the **Google Form** and response spreadsheet:

1. Make a copy of this Google Form [by clicking this link](https://docs.google.com/forms/u/4/d/1yTz6r7PnKmRthfNwJMdjV9zmSFMAl2u7OetlojIIxpM/copy) in your browser.

NOTE: the form contains the following **4** fields with the respective **title** and **field type**. Please note to **not change the order of the questions** as the **script's execution** depends on this order.

1. (Optionally) Rename the topics for the row question called:

   * "**Topics I would like to learn about**"

   **IMPORTANT** When **renaming** the topic's name and it's description, maintain the style as listed below **(TOPIC is in capital letters** and within a **parenthesis)** + **description is out of the parenthesis** since the Apps Script's code is looking for this style. You will also need to rename the same item within the code (at the top of the script)
      * EX:
      * Form's option: (NUTRITION) Raw vegan recipes
      * You rename to: (ENERGY) Going solar

1. Make a copy of **[this Google spreadsheet](https://docs.google.com/spreadsheets/u/4/d/1rnfooWa1vQtzwBEdLe4d3fdTusoAUcZ8N5rP44OT_cc/copy#gid=725229165)** which contains the code and will be where **form responses will arrive.**

1. To **map form responses** to this sheet, **return** to your **Google Form** and click **"Responses"** > **"Select response destination"** > **"Select existing spreadsheet"** > then **choose** your **newly copied** Spreadsheet from the window of files that appear, and upon selecting that file > **click** "Create."

1. Visit your **Google spreadsheet**, and **delete** the sheet tab called **"Delete this sheet after form responses are linked."** You should only have one sheet in the spreadsheet.

1. Now return to the **Google Form** > click the **top 3 dots** > select "Preview." This will bring you the live form that people will see when you share it with them. **Fill out** all the fields and **ensure** to use an **email address** you have **access** to later in order to review the email when the **run the script.**

1. Finally **make a copy** of this Google Doc **template** by **[clicking this link](https://docs.google.com/document/d/1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE/copy).** This doc contains the **format** of the email the recipients will receive upon submitting their request for content in the form. After making a copy, you will highlight and then save its **unique ID** which can be found in its **URL address** in the **browser** by copying the **number/letter** combo after **`https://docs.google.com/document/d/`** and before **`/edit#`** which will look like this: **`1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE`

NOTE** If you later wish to **change the design** of the Google Doc **template** you can by changing the font, images, colors, size. However remember to **not delete** the items **in brackets** as these are **placeholders** for the **script to populate** with custom information from the form such as `{{NAME}}` and `{{TOPICS}}` These **cannot be removed.**

## Running the script

1. Now that you submitted at least **one response** in your Form and it was transfered over to your spreadsheet, **from your Spreadsheet** lets dive into the code by clicking on the header **Tools > Script Editor**.

1. This will bring you to the **Apps Script editor.**

1. Locate on **line 3** the following `var emailTemplateDocId =` after the **equals sign** you will **replace the document ID** with ID you copied from the URL in the final step of the "setup" section. Ensure that when you paste the doc ID, it is within the backtic marks after the equal signs ex: ``var emailTemplateDocId = `1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE` ``

1. (Optional) if you **changed** any of the **topic names** in your **form**, rename those **topics exactly** in the code of the script starting at **line 15,** ensuring **both** the topics listed in the form and code have the same topics in **capital letters** with a **parenthesis** followed by a short description in **lower case without parenthesis**.

1. You will need to import a library called [ObjApp](https://sites.google.com/site/scriptsexamples/custom-methods/gs-objects) which helps **convert spreadsheet rows into objects** which **helps save time** by allowing one to call an element by its name rather than its column index. To import click **"Resources"** > **"Libraries..."** > **paste** the following **key: MTeYmpfWgqPbiBkVHnpgnM9kh30YExdAc** in the **"Add a library"** text box > click **"Add"** > change the version from the **"version"** drop down to **5** or the most recent after that > click **"Save."**

1. After importing the library,let's now **run the script** by clicking the **"Select function" drop down** > choose **"onForm Submit."** Then click the **run icon** (which looks like a play button)

1. You will be promoted to review permissions to allow the code to email on your behalf. **IMPORTANT** if you get warning that the app is not secure because it is not verified, simply click the link that shows **"advanced options"** and follow through the steps to **continue visiting this site.**

1. After granting permissions, the script will run and a new column will appear in your spreadsheet for each response entry with a date and time stamp. This confirms that the email was sent with topic URLS selected. **NOTE:** if no topics are selected, the code is meant to **not send an email.**

1. Finally, to **check** the **script worked,** login to the email account you provided in your form entry and see if you received an email with the subject line **"Howdy."**
