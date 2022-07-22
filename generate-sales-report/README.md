---
title: Generate custom sales reports automatically
description: Connect to your sales data warehouse and automatically generate presentations for particular customers.
labels: Apps Script, Sheets, Slides, BigQuery
material_icon: pie_chart
create_time: 2019-12-10
update_time: 2019-12-10
---

Annual and quarterly reports are a standard part of business 
for many enterprises. Luckily, automation can help eliminate the 
repetition inherent in these periodic obligations. 
If you find yourself needing to analyze and present findings 
from large sets of stored data, consider using automation 
to help streamline your reporting. 

This solution creates a tool that connects to sales data in 
[BigQuery][bigquery], an analytics data warehouse, from directly within 
Google Sheets. A configuration sheet allows a user to provide 
parameters for the report, such as the _Account Name_ and 
_Region_. With the click of a button, a customized report
with the latest sales data is automatically created in just 
a matter of seconds! 

![summary](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/generate-sales-report/demo.gif)

Note: This solution requires a Google Workspace Enterprise account and a Google Cloud account and 
project.

## Technology highlights

- Uses the [Sheets data connector for BigQuery][connector-support]
  to access tables in a data warehouse from directly 
  within Google Sheets.
- Uses [Google Slides][google-slides] to create a templatized 
  report.
- Uses [Apps Script][apps-script] to 
  create a chart in Google Sheets, and merge it, along with 
  sales data, into the template report.

## Try it

### Set up a Google Cloud project
This solution requires a [Google Cloud account and project][gcp-account]. The service used in this solution, BigQuery, 
has a [sandbox environment][sandbox] 
that you can use to test this solution.

1. [Sign in][sign-in] with your Google Workspace Business, Enterprise, 
or Education Account credentials. 
1. In the [Google Cloud Console][console], select or create a new Google Cloud project.

### Create a templatized slide deck

1. Make a copy of the template slide deck [here][slide-deck].
1. Identify the unique ID of your Slides document. The ID can 
be derived from the URL: `https://docs.google.com/presentation/d/`_**`slideId`**_`/edit`

### Set up the configuration spreadsheet

1. Make of copy of the template spreadsheet [here][spreadsheet].
1. From the spreadsheet, open the script editor by selecting 
**Extensions** <span aria-label="and then">></span> **Apps Script**.
1. Copy and paste your Slides document ID into line 1 of 
`Constants.gs` replacing `YOUR_SLIDES_ID` and maintaining 
the quotes.
1. Save the changes by navigating to **File > Save**.

### Generate a new report

1. Navigate to the Generator tab of your spreadsheet.
1. Choose an _Account Name_ and _Region_ in drop-down cells.
1. Navigate to the Data Results tab. At the bottom, next to 
**Refresh**, click the three dots to expand the **More options** 
menu. Select **Edit query**. 
1. In the pop-up menu, expand **Query Settings** and make sure 
your Google Cloud project is selected in the drop-down menu.
1. Click the **Connect** button. This will run the query. 
In the future, you can run the query simply by clicking **Refresh**.
1. Return to the Generator tab and click on the large 
Generate button at the bottom of the spreadsheet grid to 
initiate the creation of the report.
1. When prompted, click the **Review permissions** button.
1. Select your Google Workspace account from the list.
1. Click the **Allow** button.
1. Once the script finishes executing, navigate to 
[Google Drive][drive] and click on Recent in the 
left-side navigation bar. Your newly minted report 
will be at the top of the list!

## Next steps

To learn more about how a similar solution was built, 
check out [this blog post][blog-post]. You can also view
the [full source code][github] of this solution on GitHub to
learn more about how it was built.

You can read more about BigQuery in the 
[product documentation][bigquery], and learn how to 
load your own data [directly][load-data] or 
[through solution providers][bq-providers].

[github]: https://github.com/googleworkspace/solutions/blob/main/generate-sales-report
[connector-support]: https://support.google.com/docs/answer/9077536
[google-slides]: https://slides.google.com
[apps-script]: https://developers.google.com/apps-script/
[gcp-account]: https://cloud.google.com/apis/docs/getting-started
[sandbox]: https://cloud.google.com/bigquery/docs/sandbox
[sign-in]: https://accounts.google.com/Login
[console]: https://console.cloud.google.com
[slide-deck]:https://docs.google.com/presentation/d/1w3TraCXAvtAx2BbYfF4FHIt976ILLqqffi5L5gRhDRA/copy
[spreadsheet]:https://docs.google.com/spreadsheets/d/17wEiZoXBOzMJPx1SkpVUcVylc9qaOHouEfNbccodNaI/copy
[drive]: https://drive.google.com
[blog-post]:https://cloud.google.com/blog/products/data-analytics/simplify-reporting-with-the-sheets-data-connector-for-bigquery-and-voila-automated-content-updates-for-g-suite
[bigquery]: https://cloud.google.com/bigquery/
[load-data]: https://cloud.google.com/bigquery/docs/loading-data
[bq-providers]: https://cloud.google.com/bigquery/providers/

