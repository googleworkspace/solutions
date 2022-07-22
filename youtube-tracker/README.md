---
title: Track YouTube video views and comments
description: Tracks views, likes, and comments for provided YouTube URLs in a Google Sheet with optional email notifications.
labels: Apps Script, Sheets, Gmail, YouTube
material_icon: play_circle_filled_white
create_time: 2019-08-09
update_time: 2019-08-12
---

YouTube makes it possible for anyone to create and share video content, and
engage with viewers around the world. While the built-in analytics and
notification options provided by YouTube are designed for a user's own channel,
you may care deeply about content that extends beyond those bounds.

This solution uses the YouTube Data API to track performance of a user-curated
list of public YouTube videos, including views, likes, and comments, in a Google
Sheet. Additionally, email notifications can be enabled that send daily
summaries of videos that have new comment activity so that you can engage with
questions and comments shared for the video.

![screenshot](https://cdn.jsdelivr.net/gh/googleworkspace/solutions@main/youtube-tracker/screenshot.png)

## Technology highlights

- Uses the [YouTube advanced service](https://developers.google.com/apps-script/advanced/youtube)
  to collect data on specific videos (such as number of views and comment data)
  via the YouTube Data API.
- Uses the [Gmail Service](https://developers.google.com/apps-script/reference/gmail/)
  to send notification emails when new video comments are detected.
- Creates an [HTML template](https://developers.google.com/apps-script/guides/html/templates#calling_apps_script_functions_from_a_template)
  containing an Apps Script function to send custom notification emails.

## Try it

[![Learn more about this solution](https://img.youtube.com/vi/YOZNAQwtbyI/0.jpg)](hhttps://www.youtube.com/watch?v=YOZNAQwtbyI&list=PLU8ezI8GYqs4YntFNP9jf_rrZ0vJLSW2X&index=3)

### Spreadsheet setup

1. Make of copy of the spreadsheet [here](https://docs.google.com/spreadsheets/d/12rQe1ndU_VmmHl0QIqUi-XxQ8lWovjh0xfOHTfxOHoo/copy).
   It already contains the Apps Script code for the solution.
1. Change the name of the sheet to the full email address where you’d like to
   receive email notifications.
1. Locate URLs of videos you would like to track and add them in column A below
   cell A1. The URLs must be in format starting with "www.youtube.com/watch?v=."

### YouTube Advanced Service setup

1. From the spreadsheet, open the script editor by selecting **Extensions** <span aria-label="and then">></span> **Apps Script**.
1. In the left-hand navigation pane, select **+** next to **Services**.
1. Choose the YouTube Data API service, and click **Add**. Note: When using the template,
   you may find that this service has already been activated, in which case it will appear 
   listed below **Services** in the left-hand navigation pane.

### Test the code

1. From the script editor, choose `markVideos` from the drop-down box in the toolbar, 
   then click the Run button (▶).
3. When prompted, click the **Review permissions** button.
4. Select your Google Workspace account from the list.
5. Click the **Allow** button.
6. When the script execution completes, you should see the details added in
   columns C through H, and you will receive an email for any videos that have
   more than zero comments. When running the function in the future, you will
   only receive an email with videos whose comment count has increased since the
   last time the script was run.
1. Optionally, to turn off email notifications, change line 2 of `code.gs` from
   `'Y'` to `'N'`.

### Apps Script trigger setup

Instead of running the script manually, set it up to run at regular intervals
(such as once a day).

1. From the script editor, navigate to the left-hand vertical toolbar, and click the **Triggers** icon.
1. In the bottom right-hand corner, click the **+Add Trigger** button.
1. Under **Run**, select the `markVideos` function.
1. Under **Select event source**, choose **Time-driven**.
1. Under **Type**, select **Day timer**.
1. Select the desired time interval, such as 6am to
   7am.
1. Optionally, adjust the **Failure notification settings** to configure how and when you are 
   contacted by email if your triggered function fails.
3. Click **Save**.

## Next steps

To learn more about how it was built, check out
[this blog post](https://medium.com/@presactlyalicia/automating-youtube-comment-notifications-using-google-sheets-d5c09aa7f636).

You can also view [the full source code](https://github.com/aliciawilliams/youtube-tracker)
of this solution on GitHub.
