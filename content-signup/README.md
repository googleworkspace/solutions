# Automatically send an email following up with content to people who signup via a form.

For marketing activities, you may want to automate the sending of key links dynamically to content such as videos, whitepaper links, blogs, PDF summaries, etc based on what people mark as their specific interest in your contact-us form linked on your website, email signature, or wherever you share the form's link.

You can also ask if they would like to subscribe to your mailing list for future content.

(last updated June 28 2019)

## Setup

<!-- [START setup] -->

**First**, set up the **Google Form** and response spreadsheet:

1. Open [Google Forms](https://docs.google.com/forms/u/0/) in your browser.
1. **Create a new form** called **"Sign-up for information form"**
1. Create the following **4** fields with the respective **title** and **field type**:
   * **My name** (field type: **short answer**)

   * **Email address** (field type: **short answer**)

   * **Topics I would like to learn about** (field type: **checkboxes** with the following options. Maintain the paranethesis and capital letters as they are, the code is looking for this style).
      * (NUTRITION) Raw vegan recipes
      * (REPROGRAMMING HABITS) The Zero Waste white paper
      * (URBAN FOOD) A community garden how-to
      * (WATER DESIGN) Grey water plumbing supplies

   * **I would also like to keep receiving information in the future** (field type: **drop down** with the following **2** options...)
      * Yes add me to the mailing list.
      * No just this one time send me the assets.

1. Select a **Google Spreadsheet** as the source for **responses**.

1. Return to the Google Form and respond to all 4 fields
populated with events, ensure to use an email address you have access to. 


Next, paste the **Apps Script code in the script editor** (this type of script is called a **'container-bound script'** because it lives in a spreadsheet):

1. From your Google Spreasheet click **Tools > Script Editor** 
1. Paste the Apps Script source code that is listed in the file **src** in this GitHub.

Then run the script:

1. Click the **Select function** dropdown and select **setup**.
1. Click the Run button (►) > **SendCampaignEmail**
1. When prompted, click the **Review permissions** button.
1. Select your Google account from the list.
1. Click the **Allow** button.

Setup a trigger to **automate the script's execution** whenver a new form entry is submitted moving forward:

1. Click **Edit > Current Project's Triggers**
1. Click **Add trigger** (in the corner right bottom)
1. Select the following defaults:
   * Choose which function to run > **SendCampaignEmail**
   * Choose which deployment should run > **Head**
   * Select event source > **From Spreadsheet**
   * Select event type > **On form submit**
1. Click **Save** and accept any additional permissions if prompted.

**Important to note:**

> If you wish to change the **topic options in the form,** you must update those options (copy and paste) in the code of the script by **replacing** the options at the top, which are listed as **contanstants under 'TOPIC_URLS** The code identifies topic selection if the form's topics have an initial subject in parenthesis and capital letters followed by your desired text **ex: (NUTRITION) Raw vegan recipes.**
>
> For a more detailed record of what the script did, you
can view the logs by clicking
**View > Stackdriver Logging** and then **Apps Script Dashboard**.

[my sheet with project]: https://docs.google.com/spreadsheets/d/1E-hypjjvAth6HJcZxjz3STH-E27rljsfpU-58WpLpaM/edit#gid=1135195901


<!-- [END setup] -->