---
title: Analyze the Sentiment of News Headlines
description: A Google Sheet with Apps Script that Analyzes the sentiment of news headlines retrieved for a user specified topic from a free News API.
labels: Apps Script, Sheets, Cloud Natural Language
material_icon: Feed
create_time: 2021-03-22
update_time: 2021-03-22
---

This solution showcases natural language sentiment analysis on current news headlines. It consists of a Google Sheet that uses Apps Script to fetch the current news headlines from the free news API `newsapi.org` using a user provided `topic`.
Once the news headlines are fetched and loaded onto the sheet, it uses the Google Cloud Natural Language API to run a sentiment analysis for each headline. 
As the sentiments are returned from the API, the script updates the sheet with both a numeric score as well as a `happy`, `meh` or `sad` icon depending on the sentiment.
 
## Technology highlights

- This solution essentially demonstrates the following:
   * Shows how to add custom menus to the sheets UI.
   * Uses UrlFetch to load news headlines from an external API.
   * Demonstrates the use of the Cloud Natural Language API to analyze headlines.

## Try it

### Pre-Steps - Obtaining your API keys
To run this solution you will need to obtain 2 API keys, one from the [Google Cloud Natural Language API](https://cloud.google.com/natural-language), and the second from the free News API @ [http://newsapi.org/](http://newsapi.org/).

1.  **Google** - Configure a GCP Project to obtain an API key for the Natural Language API.
   * Create a new or use an existing GCP project: [https://console.cloud.google.com](https://console.cloud.google.com) 
   * If creating a new project: 
      * Select your associated Billing account.
      * Accept the defaults for Organization and Location.
      * Click **CREATE**, and then select the new project in the console.
   * Enable the Google Cloud Natural Language API on your GCP project by going to **APIs and Services** dashboard.
      * Click **+ ENABLE APIS AND SERVICES**
      * Search for **Cloud Natural Language API**, and enable it.
   * Click **Credentials** on the left side menu and click **+ CREATE CREDENTIALS**
      * Select **Api key** in the drop down menu. 
      * Save this key to add to your Apps Script `Code.gs` file. 

1.  **News API** - Register for a News API key.
   * Register a News API account at: [https://newsapi.org/](https://newsapi.org/)
   * Click **Get API Key** and follow the steps.
   * Save the key to add to your Apps Script `Code.gs` file. 

### Pre-Steps - Customizing your copy of the solution
Follow these steps to copy and customize the solution with your API keys.

1. Make a copy of example Google Sheet and code.
   [by clicking this link](https://docs.google.com/spreadsheets/d/1XwxcB9W9dkNBu8sSag3cwvQxGLNAeMCxXcfjm9zS9H4/copy)
   in your browser. It automatically includes the Google Apps Script code
   you need.

1. Open the associated Apps Script Project from the Sheets menu: **Extensions -> Apps Script**.
1. Update the `Code.gs` script with your API keys:
   - const googleAPIKey = `YOUR_GOOGLE_API_KEY`;
   - const newsApiKey = `YOUR_NEWS_API_KEY`;
1. Save the script and return to the Spreadsheet.

### Running the News Sentiment Analyzer
1. Click the **News Headlines Sentiments** custom menu option at the top of the sheet.
1. Select **Analyze News Headlines...**
    - Note: Upon first run, you will have to step through the Google Authorization steps. This will leave the script running, but paused. Click **Dismiss**, and click **Analyze News Headlines...** again.
1. Enter a news topic or keyword in the popup dialog. For example 'Global Warming'.
1. Click **Ok** to start the analysis! 
1. Try experimenting with other topics! 'Covid', 'Puppies', 'Tacos' ...

## Next steps

* Try other random news topics!

* Try adding code to do further steps. For example, you could save all topics and their average sentiments over time in a different tab to see if any trends emerge.

* Try running the code via a Trigger on a daily basis with a set of topics selected from a different tab.

* For further help on Apps Script coding, try the [Apps Script Fundamentals codelabs](https://developers.google.com/apps-script/quickstart/fundamentals-codelabs)

* For further info on the Google Cloud Natural Language API [See the following quickstarts](https://cloud.google.com/natural-language/docs/quickstarts).