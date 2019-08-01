# Track YouTube video views and comments

_Tracks views, likes, and comments for provided YouTube URLs in a Google Sheet with optional email notifications._

Track performance of public YouTube videos, including views, likes, and comments, in a Google Sheet. 
Refresh data automatically via the YouTube Data API. Send automatic email notifications
that summarize new YouTube video comment activity.

Last updated: July, 2019

## Technology highlights
- Use the [YouTube advanced service](https://developers.google.com/apps-script/advanced/youtube) to collect data on specific videos (such as number of views and comment data) via the YouTube Data API.
- Use the [Gmail Service] to send notification emails when new video comments are detected. 
- Create an [HTML template](https://developers.google.com/apps-script/guides/html/templates#calling_apps_script_functions_from_a_template) containing an Apps Script function to send emails containing HTML tables.

## Try it

### Spreadsheet setup
1. Make of copy of the spreadsheet [here](https://docs.google.com/spreadsheets/d/12rQe1ndU_VmmHl0QIqUi-XxQ8lWovjh0xfOHTfxOHoo/copy). It already contains the Apps Script code from this repository.
2. Change the name of the tab to the full email address where you’d like to receive email notifications. 
3. Locate URLs of videos you would like to track and add them in column A below cell A1.

### YouTube Advanced Service setup
1. From the spreadsheet, open the script editor by selecting Tools > Script editor.
2. In the script editor, select Resources > Advanced Google services.
3. In the Advanced Google Service dialog that appears, click the on/off switch next to the YouTube Data API service.
4. Click OK in the dialog.

### Test the code
1. From the script editor, choose `markVideos` from the select box in the toolbar, then click ▶.
2. You should see the details added in columns C through H, and you will receive an email for any videos that have more than zero comments. When running the function in the future, you will only receive an email with videos whose comment count has increased since the last time the script was run.
3. Optionally, to turn off email notifications, change line 2 of `code.gs` from `'Y'` to `'N'`.

### Apps Script trigger setup 
Instead of running the script manually, set it up to run at regular intervals (such as once a day).
1. From the script editor, choose Edit > Current project's triggers.
2. Click the link that says: No triggers set up. Click here to add one now.
3. Under Run, select the `markVideos` function.
4. Under Select event source, choose Time-driven.
5. Under type, select Day timer.
6. Then select time of day, such as 6am to 7am.
7. Optionally, click Notifications to configure how and when you are contacted by email if your triggered function fails.
7. Click Save.

## Next steps

To learn more about how it was built, check out [this blog post](https://medium.com/@presactlyalicia/automating-youtube-comment-notifications-using-google-sheets-d5c09aa7f636).

You can also view [the full source code](https://github.com/aliciawilliams/youtube-tracker) of this solution on GitHub.
