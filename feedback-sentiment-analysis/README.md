---
title: Analyze sentiment of open-ended feedback
description: Analyze text data, such as open-ended feedback, at scale by performing entity and sentiment analysis directly in Google Sheets.
labels: Apps Script, Sheets, Cloud Natural Language
material_icon: feedback
create_time: 2019-08-21
update_time: 2019-08-29
---

There are many formulas in Google Sheets for analyzing quantitative data,
but spreadsheets often capture valuable text data as well. Text data in
Google Sheets can come from many sources: Google Form responses, notes columns,
descriptions, and more. As humans we can make sense of this data by reading it,
but this becomes difficult as your data grows into hundreds or thousands of rows.

The <a href="https://cloud.google.com/natural-language/docs/" target="_blank">Cloud Natural Language API</a>
takes the machine learning technology used by Google Search and Google Assistant
and makes it possible for anyone to perform sentiment and entity analysis on
their own data.

This solution uses <a href="https://developers.google.com/apps-script/" target="_blank">Apps Script</a> in
a Google Sheet to perform entity and sentiment analysis on vacation rental reviews
using the Cloud Natural Language API.

![summary](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/feedback-sentiment-analysis/summaryimage.png)

## Technology highlights

- Uses the [Cloud Natural Language API](https://cloud.google.com/natural-language/docs/)
  to perform entity and sentiment analysis on text.
- Uses the [`SpreadsheetApp`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app)
  and [`URL Fetch`](https://developers.google.com/apps-script/reference/url-fetch/)
  services to programmatically send multiple rows of text data to the
  Cloud Natural Language API service and paste response data
  into a spreadsheet.
- Adds a custom menu to Google Sheets using the
[`Ui` service](https://developers.google.com/apps-script/reference/base/ui).

## Try it

[![Learn more about this solution](https://img.youtube.com/vi/5yZY6fftKPk/0.jpg)](https://www.youtube.com/watch?v=5yZY6fftKPk&list=PLU8ezI8GYqs4YntFNP9jf_rrZ0vJLSW2X&index=2)

### Set up a Google Cloud Platform project
This solution requires a [Google Cloud Platform account and project](https://cloud.google.com/apis/docs/getting-started). The service used in this solution, Cloud Natural Language API,
has a [free tier](https://cloud.google.com/natural-language/#natural-language-api-pricing)
that you can use to test this solution for free.

1. [Sign in](https://accounts.google.com/Login) to your Google Account.
If you don't already have one, [sign up for a new account](https://accounts.google.com/SignUp).
1. In the [GCP Console](https://console.cloud.google.com), on the project selector page,
select or create a GCP project.
1. Make sure that [billing is enabled](https://cloud.google.com/billing/docs/how-to/modify-project)
for your Google Cloud Platform project.
1. [Enable the Google Natural Language API](https://console.cloud.google.com/flows/enableapi?apiid=language.googleapis.com&redirect=https://console.cloud.google.com) for your project.
1. Create an API key following [these instructions](https://cloud.google.com/docs/authentication/api-keys).

### Set up a spreadsheet

1. Make of copy of the spreadsheet [here](https://docs.google.com/spreadsheets/d/1BwcPKL3bSpwGHcNrbYRsuUPZTW8kH_c_NT2gFKnwj_8/copy).
1. From the spreadsheet, open the script editor by selecting
**Extensions** <span aria-label="and then">></span> **Apps Script**.
1. Copy and paste your API key into line 1 of `code.gs` replacing
`YOUR_API_KEY_HERE` and maintaining the quotes.
1. Save the changes by navigating to **File > Save**.

### Add text data

1. Return to the sheet, and reload your browser.
1. Add sample text data to columns A-F. Sample vacation property reviews
with a matching schema to the template are available on
[Kaggle](https://www.kaggle.com/airbnb/seattle#reviews.csv)
and can be copied and pasted directly from the data preview pane.
Alternatively, you may add your own data. Keep in mind that the script
requires data in column B (id) and column F (comments) at a minimum in
order to execute successfully.
1. Ensure that columns G and H, which use built-in Sheets functions to
detect the comment language and provide an English translation, are properly
populated using the formula provided in row 2 of the template.

### Run the script

1. To run the script, navigate to the custom menu
**Sentiment tools > Mark entities and sentiment**.
If the menu is not present, reload your browser window.
1. When prompted, click the **Review permissions** button.
1. Select your Google Workspace account from the list.
1. Click the **Allow** button.
1. As the script executes, you will see response data populating
the Entity Sentiment Data sheet and a completion flag in each
row of the Review Data sheet.

### Analyze the results

1. When the script finishes execution, navigate to the Pivot Table
tab to see a pivot table summarizing the average sentiment score
for each entity mentioned across all rows of text data.
1. More information on interpreting sentiment scores can be found
in the [Cloud Natural Language API documentation](https://cloud.google.com/natural-language/docs/basics#interpreting_sentiment_analysis_values).

## Next steps

To learn more about how it was built, check out
[this blog post](https://cloud.google.com/blog/products/gcp/analyzing-text-in-a-google-sheet-using-cloud-natural-language-api-and-apps-script).

A video of a talk stepping through a similar solution
can be found on [YouTube](https://www.youtube.com/watch?v=Y2wgQjxrPD8).
