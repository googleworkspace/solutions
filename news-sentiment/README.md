---
title: Analyze the sentiment of news headlines
description: Analyze the sentiment of news headlines retrieved for a user-specified topic from a free news API.
labels: Apps Script, Sheets, Cloud Natural Language
material_icon: Feed
create_time: 2021-03-22
update_time: 2021-03-30
---

This solution showcases natural language sentiment analysis on current news headlines. It consists of a Google Sheet that uses Apps Script to fetch the current news headlines from the free news API `newsapi.org` using a user-provided `topic`.
Once the news headlines are fetched and loaded into the sheet, it uses the Google Cloud Natural Language API to run a sentiment analysis for each headline. 
As the sentiments are returned from the API, the script updates the sheet with both a numeric score as well as a `happy`, `meh`, or `sad` icon depending on the sentiment.
 
## Technology highlights

- This solution demonstrates the following:
   * Shows how to add custom menus to the Sheets UI.
   * Uses `UrlFetch` to load news headlines from an external API.
   * Demonstrates the Cloud Natural Language API to analyze headlines.

## Try it

### Before you begin: Obtain your API keys
To run this solution you need to get 2 API keys, one from the [Google Cloud Natural Language API](https://cloud.google.com/natural-language), and the second from the free [News API](http://newsapi.org/).

#### Get the Google Cloud Natural Language API key

To get an API key for the Google Cloud Natural Language API, you must configure a Google Cloud Platform (GCP) project.

1. Create a new or use an existing GCP project.
1. Navigate to the [Google Cloud Platform console](https://console.cloud.google.com).
    * If you create a new project: 
        * Select your associated billing account.
        * Accept the defaults for organization and location.
        * Click **Create**, and then select the new project in the console.
1. At the top of the console, click Menu <span class="material-icons">menu</span> <span aria-label="and then">></span> **APIs & Services**. 
1. Click **+ Enable APIs and Services**.
1. Search for `Cloud Natural Language API`, and enable it.
1. On the left, click **Credentials** <span aria-label="and then">></span> **+ Create credentials**.
1. In the drop-down menu, select **API key**. 
1. Save this key to add to your Apps Script `Code.gs` file. 

#### Register for the News API key

To get an API key for the News API, you need to create a free News API account.
1. To create an account, go to the [News API](https://newsapi.org/) site.
1. Click **Get API Key** and follow the steps.
1. Save the key to add to your Apps Script `Code.gs` file. 

### Create your copy of the solution
Copy and customize the solution with your API keys.

1. Make a copy of the [News Sentiment Analyzer - External spreadsheet](https://docs.google.com/spreadsheets/d/1Jw-d2ihbjSyO4SyzgXSiC5dzs36GY5aMGxuf_nc7WKU/copy). 

1. To open the associated Apps Script Project, at the top, click **Tools <span aria-label="and then">></span> Script editor**.
1. Update the `Code.gs` script file with your API keys:
    * const googleAPIKey = `YOUR_GOOGLE_API_KEY`;
    * const newsApiKey = `YOUR_NEWS_API_KEY`;
1. Save the script and return to the spreadsheet.

### Run the News Sentiment Analyzer
1. At the top of the spreadsheet, click the custom menu item **News Headlines Sentiments**.
1. Select **Analyze News Headlines**. 
    * Note: Upon first run, you must go through the Google authorization steps. This leaves the script running, but paused. After you authorize the script, click **Dismiss**, and select **Analyze News Headlines** again.
1. In the dialog, enter a news topic or keyword. For example `Global Warming`.
1. Click **Ok** to start the analysis. 

## Next steps

* Experiment with other news topics.

* Try adding code to do further steps. For example, you could save all topics and their average sentiments over time in a different tab to see if any trends emerge.

* Add a time-based trigger to run the code on a daily basis with a set of topics selected from a different tab.

* For more help with Apps Script coding, try the [Apps Script Fundamentals codelabs](https://developers.google.com/apps-script/quickstart/fundamentals-codelabs).

* For more information on the Google Cloud Natural Language API, [try a quickstart](https://cloud.google.com/natural-language/docs/quickstarts).
