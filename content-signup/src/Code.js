/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var EMAIL_TEMPLATE_DOC_URL = 'https://docs.google.com/document/d/1HGXj6551jxUqFqxsuYMWovI0_nypSUPIdlc-RXf2pHE/edit?usp=sharing';
var EMAIL_SUBJECT = 'Howdy, here is the content you requested';

var topicUrls = {
  'Nutrition': 'https://youtu.be/kCjDirATBos',
  'Reprogramming Habits': 'https://www.mindful.org/category/meditation/',
  'Urban Food': 'https://www.urbanfarm.org/',
  'Water Design': 'https://greywateraction.org/',
};

/**
 * Installs a trigger on the Spreadsheet for when a Form response is submitted.
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
 * @param {Object} e - Form submit event
 */
function onFormSubmit(e) {
  var responses = e.namedValues;

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
  } else {
    status = 'No topics selected';
  }

  // Append the status on the spreadsheet to the responses' row.
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveRange().getRow();
  var column = e.values.length + 1;
  sheet.getRange(row, column).setValue(status);

  Logger.log('status=' + status + '; responses=' + JSON.stringify(responses));
}

/**
 * Creates email body and includes the links based on topic.
 *
 * @param {string} name - The recipient's name.
 * @param {string[]} topics - List of topics to include in the email body.
 * @return {string} - The email body as an HTML string.
 */
function createEmailBody(name, topics) {
  var topicsHtml = topics.map(function(topic) {
    var url = topicUrls[topic];
    return '<li><a href="' + url + '">' + topic + '</a></li>';
  }).join('');
  topicsHtml = '<ul>' + topicsHtml + '</ul>';

  // Make sure to update the emailTemplateDocId at the top.
  var docId = DocumentApp.openByUrl(EMAIL_TEMPLATE_DOC_URL).getId();
  var emailBody = docToHtml(docId);
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
  // Downloads a Google Doc as an HTML string.
  var url = 'https://docs.google.com/feeds/download/documents/export/Export?id=' +
            docId + '&exportFormat=html';
  var param = {
    method: 'get',
    headers: {'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()},
    muteHttpExceptions: true,
  };
  return UrlFetchApp.fetch(url, param).getContentText();
}
