// Email template, paste Google Doc ID to display email format.
// Make sure the Google Doc is shareable.
const EMAIL_TEMPLATE_DOC_ID = '1j8MSwn6vK3Y_0uRzGV0Kok8AT5r1NbycoGimN0jYv68';

// Sheet column names.
const TIMESTAMP = 'timestamp';
const NAME = 'myName';
const EMAIL = 'emailAddress';
const TOPICS = 'onTheFollowingTopics';
const IN_MAILING_LIST = 'iWouldAlsoLikeToKeepReceivingInformationInTheFuture';
const EMAIL_SENT_DATE = 'emailSentDate';

// Links to send based on topics selected in form by user.
const TOPIC_URLS = {
  'Nutrition': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
  'Reprogramming Habits': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
  'Urban Food': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
  'Water Design': 'https://docs.google.com/forms/d/e/1FAIpQLSch2B-ac_kS9ENNNlGeJK3Lba6Cs-UvjX5i4vNHjBnZYBv0kw/viewform',
};

// Get the active spreadsheet.
var ss = SpreadsheetApp.getActive();

// This is only used to ask for Drive scope permissions, used by the
//`docToHtml` function.
DriveApp.getStorageUsed();

// Must click this function from the top drop-down and click 'run' icon to
// activate setup of Form to activate on submit.
function setup() {
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}

// Reviews each row to see who to send an email to.
function onFormSubmit() {
  let sheet = ss.getSheets()[0];
  let rows = sheet.getDataRange().getValues();
  
  // ObjApp library uses the rangeToObjects() method to create a list of
  // objects from the spreadsheet rows.
  let recipients = ObjApp.rangeToObjects(rows);
  for (recipient of recipients) {
    // If an email was already sent, skip.
    if (recipient[EMAIL_SENT_DATE])
      continue;

    // Parse topics of interest into a list (since there are multiple items
    // that are saved in the row as blob text).
    let topics = [];
    for (let topic in TOPIC_URLS) {
      if (recipient[TOPICS].includes(topic.toUpperCase())) {
        topics.push(topic);
      }
    }

    // If there is at least one topic selected, send email to the recipient,
    // with this subject and email body.
    if (topics.length > 0) {
      let emailBody = createEmailBody(recipient, topics);
      MailApp.sendEmail({
        to: recipient[EMAIL],
        subject: "Howdy",
        htmlBody: emailBody,
      });
    }
    
    // Write the email sent date on the 'F' column.
    let now = new Date();
    sheet.getRange(`F${recipient.rowNum+1}`).setValue(now.toString());

    // Logs activity.
    Logger.log(JSON.stringify(recipient));
  }
}

// Creates email body and includes the links based on topic.
function createEmailBody(recipient, topics) {
  let topicsHTML = '<ul>\n';
  for (let topic of topics) {
    let url = TOPIC_URLS[topic];
    topicsHTML += `<li><a href="${url}">${topic}</a></li>\n`;
  }
  topicsHTML += '</ul>';
  
  // Make sure to update the EMAIL_TEMPLATE_DOC_ID at the top.
  let emailBody = docToHtml(EMAIL_TEMPLATE_DOC_ID);
  Logger.log(JSON.stringify(emailBody));
  emailBody = emailBody.replace('{{NAME}}', recipient[NAME]);
  emailBody = emailBody.replace('{{TOPICS}}', topicsHTML);
  return emailBody;
}

// Fetches a Google Doc as an HTML string. 
function docToHtml(doc_id) {
  let url = "https://docs.google.com/feeds/download/documents/export/Export?id="+doc_id+"&exportFormat=html";
  let param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}