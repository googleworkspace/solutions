// Copyright Martin Hawksey 2019
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License.  You may obtain a copy
// of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
// License for the specific language governing permissions and limitations under
// the License.
 
/**
 * @OnlyCurrentDoc
*/
 
/**
 * Change these to match the column names you are using for email 
 * recepient addresses and email sent column.
*/
var RECIPIENT_COL  = "Recipient";
var EMAIL_SENT_COL = "Email Sent";
 
/** 
 * Creates the menu item "Mail Merge" for user to run scripts on drop-down.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Mail Merge')
      .addItem('Send Emails', 'sendEmails')
      .addToUi();
}
 
/** 
 * Send emails from the active sheet data.
 */
function sendEmails() {
  var subjectLine = Browser.inputBox("Mail Merge", 
                                     "Type or copy/paste the subject line of the Gmail " +
                                     "draft message you would like to mail merge with:",
                                     Browser.Buttons.OK_CANCEL);
                                     
  if (subjectLine === "cancel" || subjectLine == ""){ 
   // if no subject line finish up
   return;
  }
  
  // get the draft Gmail message to use as a template
  var emailTemplate = getGmailTemplateFromDrafts_(subjectLine);
  emailTemplate.subject = subjectLine;
  
  // get the data from the active sheet
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange();
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  // assuming row 1 contains our column headings
  var header = data.shift(); 
  
  // get the index of column named 'Email Status' (Assume header names are unique)
  // @see http://ramblings.mcpher.com/Home/excelquirks/gooscript/arrayfunctions
  var emailSentColIdx = header.indexOf(EMAIL_SENT_COL);
  
  // convert 2d array into object array
  // @see https://stackoverflow.com/a/22917499/1027723
  // for pretty version see https://mashe.hawksey.info/?p=17869/#comment-184945
  var obj = data.map(function(values) {
    return header.reduce(function(o, k, i) {
      o[k] = values[i];
      return o;
    }, {});
  });
  
  // loop through all the rows of data
  obj.forEach(function(row, rowIdx){
    // only send emails is email_sent cell is blank
    if (row[EMAIL_SENT_COL] === ''){
      try {
        var msgObj = fillInTemplateFromObject_(emailTemplate, row);
        // @see https://developers.google.com/apps-script/reference/gmail/gmail-app#sendemailrecipient-subject-body-options
        GmailApp.sendEmail(row[RECIPIENT_COL], msgObj.subject, msgObj.text, {
          htmlBody: msgObj.html
        });
        // modify cell to record email sent date
        data[rowIdx][emailSentColIdx] = new Date();
      } catch(e) {
        // modify cell to record error
        data[rowIdx][emailSentColIdx] = e.message;
      }
    }
  });
  
  // updating the sheet with new data
  dataRange.offset(1, 0, data.length).setValues(data);
}
 
/**
 * Get a Gmail draft message by matching the subject line.
 * @param {string} subject_line to search for draft message
 * @return {object} containing the plain and html message body
*/
function getGmailTemplateFromDrafts_(subject_line) {
  try {
    // get drafts
    var drafts = GmailApp.getDrafts();
    // filter the drafts that match subject line
    var draft = drafts.filter(subjectFilter_(subject_line))[0];
    // get the message object
    var msg = draft.getMessage();
    return {text: msg.getPlainBody(), html:msg.getBody()};
  } catch(e) {
    throw new Error("Oops - can't find Gmail draft");
  }
}
 
/**
 * Filter draft objects with the matching subject linemessage by matching the subject line.
 * @param {string} subject_line to search for draft message
 * @return {object} GmailDraft object
*/
function subjectFilter_(subject_line){
  return function(element) {
    if (element.getMessage().getSubject() === subject_line) {
      return element;
    }
  }
}
 
/**
 * Fill HTML string with data object.
 * @param {string} template string containing {{}} markers which are replaced with data
 * @param {object} data object used to replace {{}} markers
 * @return {object} message replaced with data
 * H/T https://developers.google.com/apps-script/articles/mail_merge
*/
function fillInTemplateFromObject_(template, data) {
  // convert object to string for simple find and replace
  template = JSON.stringify(template);
  // Search for all the variables to be replaced, for instance {{Column name}}
  var templateVars = template.match(/{{([^}]+)}}/g);
 
  // H/T @jackboyce https://github.com/gsuitedevs/solutions/issues/98#issue-545173529
  if(templateVars == null) return JSON.parse(template);
 
  // Replace variables from the template with the actual values from the data object.
  // If no value is available, replace with the empty string.
  for (var i = 0; i < templateVars.length; ++i) {
    // strip out {{ }} 
    var variableData = data[templateVars[i].substring(2, templateVars[i].length - 2)];
    template = template.replace(templateVars[i], variableData || "");
  }
  // convert back to object
  return JSON.parse(template);
}
