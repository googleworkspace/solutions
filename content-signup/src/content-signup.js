// Email template, paste Google Doc ID to display email format.
// Make sure the Google Doc is shareable.
var emailTemplateDocId = '1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE';

// Sheet column names.
var timestamp = 'timestamp';
var name = 'myName';
var email = 'emailAddress';
var selectedTopics = 'onTheFollowingTopics';
var inMailingList = 'iWouldAlsoLikeToKeepReceivingInformationInTheFuture';
var emailSentDate = 'emailSentDate';

// Additional columns.
var sentDateColumn = 'E';

// Links to send based on topics selected in form by user.
var topicUrls = {
  'Nutrition': 'https://www.youtube.com/watch?v=yBJ54pSJOvg',
  'Reprogramming Habits': 'https://www.tonyrobbins.com/ask-tony/priming/',
  'Urban Food': 'https://www.urbanfarm.org/',
  'Water Design': 'http://oasisdesign.net/',
};

// This is only used to ask for Drive scope permissions, used by the
// `docToHtml` function. It can be commented out like it is below.
// DriveApp.getStorageUsed();

/**
 * Must click this function from the top drop-down and click 'run' icon to
 * create the onFormSubmit trigger.
 */
function installTrigger() {
  ScriptApp.newTrigger('onFormSubmit')
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onFormSubmit()
      .create();
}

/**
 * Reviews each row to see who to send an email to.
 */
function onFormSubmit() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  
  // ObjApp library uses the rangeToObjects() method to create a list of
  // objects from the spreadsheet rows.
  var recipients = ObjApp.rangeToObjects(rows);
  for (var i in recipients) {
    var recipient = recipients[i];

    // If an email was already sent, skip.
    if (recipient[emailSentDate])
      continue;

    // Parse topics of interest into a list (since there are multiple items
    // that are saved in the row as blob text).
    var topics = [];
    for (var topic in topicUrls) {
      if (recipient[selectedTopics].indexOf(topic.toUpperCase()) != -1) {
        topics.push(topic);
      }
    }

    // If there is at least one topic selected, send email to the recipient,
    // with this subject and email body.
    if (topics.length > 0) {
      var emailBody = createEmailBody(recipient, topics);
      MailApp.sendEmail({
        to: recipient[email],
        subject: "Howdy",
        htmlBody: emailBody,
      });
    }

    // Write the email sent date on the "Sent date" column.
    var now = new Date();
    var column = sentDateColumn.charCodeAt(0) - 'A'.charCodeAt(0);
    sheet.getRange(recipient.rowNum+1, column+1).setValue(now.toString());

    // Logs activity.
    Logger.log(JSON.stringify(recipient));
  }
}

/**
 * Creates email body and includes the links based on topic.
 * 
 * @param {string} recipient - The recipient's email address.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} The email body as an HTML string.
 */
function createEmailBody(recipient, topics) {
  var topicsHTML = '<ul>\n';
  for (var i in topics) {
    var topic = topics[i];

    var url = topicUrls[topic];
    topicsHTML += '<li><a href="'+url+'">'+topic+'</a></li>\n';
  }
  topicsHTML += '</ul>';
  
  // Make sure to update the emailTemplateDocId at the top.
  var emailBody = docToHtml(emailTemplateDocId);
  Logger.log(JSON.stringify(emailBody));
  emailBody = emailBody.replace('{{NAME}}', recipient[name]);
  emailBody = emailBody.replace('{{TOPICS}}', topicsHTML);
  return emailBody;
}

/**
 * Fetches a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" + docId + "&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
