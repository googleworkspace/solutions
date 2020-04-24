// Copyright Martin Hawksey 2020
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
const RECIPIENT_COL  = "Recipient";
const EMAIL_SENT_COL = "Email Sent";
 
/** 
 * Creates the menu item "Mail Merge" for user to run scripts on drop-down.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Mail Merge')
      .addItem('Send Emails', 'sendEmails')
      .addToUi();
}
 
/**
 * Send emails from sheet data.
 * @param {string} subjectLine (optional) for the email draft message
 * @param {Sheet} sheet to read data from
*/
function sendEmails(subjectLine, sheet=SpreadsheetApp.getActiveSheet()) {
  // option to skip browser prompt if you want to use this code in other projects
  if (!subjectLine){
    subjectLine = Browser.inputBox("Mail Merge", 
                                      "Type or copy/paste the subject line of the Gmail " +
                                      "draft message you would like to mail merge with:",
                                      Browser.Buttons.OK_CANCEL);
                                      
    if (subjectLine === "cancel" || subjectLine == ""){ 
    // if no subject line finish up
    return;
    }
  }
  
  // get the draft Gmail message to use as a template
  const emailTemplate = getGmailTemplateFromDrafts_(subjectLine);
  
  // get the data from the passed sheet
  const dataRange = sheet.getDataRange();
  // Fetch values for each row in the Range 
  // @see https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
  const data = Sheets.Spreadsheets.Values.get(SpreadsheetApp.getActive().getId(), sheet.getName()).values;
  // assuming row 1 contains our column headings
  const heads = data.shift(); 
  // build an A1 notation of the data range for addFilteredRows_()
  const valuesRange = dataRange.offset(1,0,sheet.getLastRow()-1);
  const valueRangeA1 = sheet.getName() + '!' + valuesRange.getA1Notation();
  
  // get the index of column named 'Email Status' (Assume header names are unique)
  // @see http://ramblings.mcpher.com/Home/excelquirks/gooscript/arrayfunctions
  const emailSentColIdx = heads.indexOf(EMAIL_SENT_COL);
  
  // convert 2d array into object array
  // @see https://stackoverflow.com/a/22917499/1027723
  // for pretty version see https://mashe.hawksey.info/?p=17869/#comment-184945
  const obj = data.map(r => (heads.reduce((o, k, i) => (o[k] = r[i] || '', o), {})));

  // get filtered row data to only send to visible rows
  const sub_obj = addFilteredRows_(SpreadsheetApp.getActive().getId(), valueRangeA1, obj);

  // used to record sent emails
  const out = [];

  // loop through all the rows of data
  sub_obj.forEach(function(row, rowIdx){
    // only send emails is email_sent cell is blank
    if (row[EMAIL_SENT_COL] == '' && !row.hidden){
      try {
        const msgObj = fillInTemplateFromObject_(emailTemplate.message, row);

        // @see https://developers.google.com/apps-script/reference/gmail/gmail-app#sendEmail(String,String,String,Object)
        // if you need to send emails with unicode/emoji characters change GmailApp for MailApp
        // Uncomment advanced parameters as needed (see docs for limitations)
        GmailApp.sendEmail(row[RECIPIENT_COL], msgObj.subject, msgObj.text, {
          htmlBody: msgObj.html,
          // bcc: 'a.bbc@email.com',
          // cc: 'a.cc@email.com',
          // from: 'an.alias@email.com',
          // name: 'name of the sender',
          // replyTo: 'a.reply@email.com',
          // noReply: true, // if the email should be sent from a generic no-reply email address (not available to gmail.com users)
          attachments: emailTemplate.attachments
        });
        // modify cell to record email sent date
        out.push([new Date()]);
      } catch(e) {
        // modify cell to record error
        out.push([e.message]);
      }
    } else {
      out.push([row[EMAIL_SENT_COL]]);
    }
  });
  
  // updating the sheet with new data
  sheet.getRange(2, emailSentColIdx+1, out.length).setValues(out);
  
  /**
   * Get a Gmail draft message by matching the subject line.
   * @param {string} subject_line to search for draft message
   * @return {object} containing the subject, plain and html message body and attachments
  */
  function getGmailTemplateFromDrafts_(subject_line){
    try {
      // get drafts
      const drafts = GmailApp.getDrafts();
      // filter the drafts that match subject line
      const draft = drafts.filter(subjectFilter_(subject_line))[0];
      // get the message object
      const msg = draft.getMessage();
      // getting attachments so they can be included in the merge
      const attachments = msg.getAttachments();
      return {message: {subject: subject_line, text: msg.getPlainBody(), html:msg.getBody()}, 
              attachments: attachments};
    } catch(e) {
      throw new Error("Oops - can't find Gmail draft");
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
  }
  
  /**
   * Fill template string with data object
   * @see https://stackoverflow.com/a/378000/1027723
   * @param {string} template string containing {{}} markers which are replaced with data
   * @param {object} data object used to replace {{}} markers
   * @return {object} message replaced with data
  */
  function fillInTemplateFromObject_(template, data) {
    // we have two templates one for plain text and the html body
    // stringifing the object means we can do a global replace
    let template_string = JSON.stringify(template);

    // token replacement
    template_string = template_string.replace(/{{[^{}]+}}/g, key => {
      return data[key.replace(/[{}]+/g, "")] || "";
    });
    return  JSON.parse(template_string);
  }

  /**
   * Add hidden row identifier to sheet data.
   * @see https://sites.google.com/site/scriptsexamples/learn-by-example/google-sheets-api/filters#TOC-Get-filtered-rows
   * @see https://tanaikech.github.io/2019/07/28/retrieving-values-from-filtered-sheet-in-spreadsheet-using-google-apps-script/
   * @param {string} ssId of the spreadsheet
   * @param {string} range of the sheet
   * @param {Object} sourceData of sheet as object
   * @return {Array} of data with hidden row identifier.
   */
  function addFilteredRows_(ssId, range, sourceData) {
    // limit what's returned from the API
    const fields = "sheets/data/rowMetadata/hiddenByFilter";

    // make Sheets API call
    const sheet = Sheets.Spreadsheets.get(ssId, {
      fields: fields,
      ranges: [range]
    }).sheets[0];

    // get the row metadata
    const data = sheet.data[0].rowMetadata;
    // update sourceData with hidden row status
    data.map((ar,i) => {(ar.hiddenByFilter) ? sourceData[i].hidden = true : sourceData[i].hidden = false;});
    return sourceData;
  }
}
 
