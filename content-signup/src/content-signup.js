// Paste Google Doc ID of your custom email template.
// Make sure that Google Doc is shareable.
var EMAIL_TEMPLATE_DOC_ID = '1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE';
var EMAIL_SUBJECT = 'Howdy';

// Links to send based on topics selected in form by user.
var topicUrls = {
  'Nutrition': 'https://www.youtube.com/watch?v=yBJ54pSJOvg',
  'Reprogramming Habits': 'https://www.tonyrobbins.com/ask-tony/priming/',
  'Urban Food': 'https://www.urbanfarm.org/',
  'Water Design': 'http://oasisdesign.net/',
};

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
 * Sends a customized email for every response on a form.
 *
 * To see more of the onFormSubmit event, see:
 * https://developers.google.com/apps-script/guides/triggers/events#form-submit
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

  // Get all the response values and store them in local variables.
  // If the question title is a label, it can be accessed as an object field.
  // If it has spaces or other characters, it can be accessed as a dictionary.
  var timestamp = responses.Timestamp[0];
  var email = responses['Email Address'][0].trim();
  var name = responses.Name[0].trim();
  var topicsString = responses.Topics[0].toLowerCase();

  // Parse topics of interest into a list (since there are multiple items
  // that are saved in the row as blob of text).
  var topics = Object.keys(topicUrls).filter(function(topic) {
    // indexOf searches for the topic in topicsString and returns a non-negative
    // index if the topic is found, or it will return -1 if it's not found.
    return topicsString.indexOf(topic.toLowerCase()) != -1;
  });

  // If there is at least one topic selected, send an email to the recipient.
  var status = '';
  if (topics.length > 0) {
    MailApp.sendEmail({
      to: email,
      subject: EMAIL_SUBJECT,
      htmlBody: createEmailBody(name, topics),
    });
    status = 'Sent';
  }
  else {
    status = 'No topics selected';
  }

  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var column = e.values.length + 1;
  sheet.getRange(row, column).setValue(status);

  // Log activity.
  Logger.log("status=" + status + "; responses=" + JSON.stringify(responses));
}

/**
 * Creates email body and includes the links based on topic.
 *
 * @param {string} recipient - The recipient's email address.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} The email body as an HTML string.
 */
function createEmailBody(name, topics) {
  var topicsHtml = topics.map(function(topic) {
  var url = topicUrls[topic];
    return '<li><a href="' + url + '">' + topic + '</a></li>';
  }).join('');
  topicsHtml = '<ul>' + topicsHtml + '</ul>';
  
  // Make sure to update the emailTemplateDocId at the top.
  var emailBody = docToHtml(EMAIL_TEMPLATE_DOC_ID);
  emailBody = emailBody.replace(/{{NAME}}/g, name);
  emailBody = emailBody.replace(/{{TOPICS}}/g, topicsHtml);
  return emailBody;
}

/**
 * Downloads a Google Doc as an HTML string.
 * 
 * @param {string} docId - The ID of a Google Doc to fetch content from.
 * @return {string} The Google Doc rendered as an HTML string.
 */
function docToHtml(docId) {
  // We need Drive scope permissions to fetch a Google Doc with UrlFetchApp.
  // Calling any DriveApp function will ask for those permissions,
  // this can be commented in the following line:
  //   DriveApp.getStorageUsed();

  // Downloads a Google Doc as an HTML string.
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" +
            docId + "&exportFormat=html";
  var param = {
    method: "get",
    headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
