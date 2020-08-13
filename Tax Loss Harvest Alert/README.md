---
title: Tax Loss Harvest Alert with Google Finance
description: List your stocks and purchase prices in a Google Sheet, and this script will alert you if you can sell the stock for a "tax loss harvest"
labels: Apps Script, Sheets, Google Finance
material_icon: event
create_time: 2020-06-14
update_time: 2020-006-14
---

Contributed by Jeremy Glassenberg [Site](https://www.apistrategist.com)

When we purchase a stock and find the value dropped, there's an opportunity to sell that stock, purchase another, and claim a tax deduction.  However, many brokerages don't let you know when you have that opportunity.  

This script works with Google Sheets to alert you when stocks in your portfolio fall below purchase price.  To use this script, your portfolio information into the Google Sheet, so the sheet knows what stocks you own and at what purchase prices. If anything falls below purchase price, you'll be notified via email of a tax loss harvest opportunity.

![screenshot](screenshot.png)

## Technology highlights

- The [`SpreadsheetApp` service][spreadsheetapp-docs] is used to provide stored information to the Apps Script
- [Google Finance formula in Google Sheets](https://support.google.com/docs/answer/3093281?hl=en) are used to check stock prices in real-time and alert the script of changes


## Try it

1. Copy this [sheet][sheet-copy]
2. In the calculations tab make sure your information in columns A through D are up to date
3. Copy and apply this [script] [script-copy] to check for tax-loss harvesting opportunities.
4. Set a trigger for the script to run hourly, or daily, or however frequently you want to check for opportunities.

## Next steps


To get started with Google Apps Script, try out [the codelab][codelab]
which guides you through the creation of your first script.

You can also view the [full source code][github] of this solution on GitHub to
learn more about how it was built.

[script-copy]: https://github.com/gsuitedevs/solutions/tree/master/Tax%20Loss%20Harvest%20Alert/src/code.js
[github]: https://github.com/gsuitedevs/solutions/blob/master/
[spreadsheetapp-docs]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app
[sheet-copy]: https://docs.google.com/spreadsheets/d/1G4VZLU7mSb-cVLXyMfCjM1R5EHQMV8mmRKeZSvXEQsU/copy
