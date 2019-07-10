// Copyright 2019 Google LLC
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

// Global variables representing the index of certain columns.
var COLUMN_NUMBER = {
  EMAIL: 3,
  HOURS_START: 4,
  HOURS_END: 8,
  HOURLY_PAY: 9,
  CALC_PAY: 10,
  APPROVAL: 11,
};

/** Creates the menu item "Timesheets" so user can run scripts on drop-down.
*/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Timesheets')
      .addItem('Column Setup', 'columnSetup')
      .addItem('Send Emails', 'sendEmails')
      .addToUi();
}

/** Runs the "Column Setup" script. Adds "WEEKLY PAY" column with calculated
 * values using array formulas. Adds an "APPROVAL" column at the end of
 * the sheet, containing drop-down menus to either approve/disapprove employee
 * timesheets.  Adds a "NOTIFIED STATUS" column indicating whether or not an
 * employee has yet been e mailed.
*/
function columnSetup() {
  // defines variables
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // adds new calculate pay column
  sheet.insertColumnAfter(COLUMN_NUMBER.HOURLY_PAY);
  sheet.getRange(1, COLUMN_NUMBER.CALC_PAY).setValue('WEEKLY PAY');

  // calculates weekly pay using array formulas
  sheet.getRange(beginningRow, COLUMN_NUMBER.CALC_PAY)
      .setFormula('=ArrayFormula(SUM(D2:H2) * I2:I)');

  // adds new approval column
  sheet.insertColumnAfter(COLUMN_NUMBER.CALC_PAY);
  sheet.getRange(1, COLUMN_NUMBER.APPROVAL).setValue('APPROVAL');

  // make sure approval column is all drop-down menus
  var approvalColumnRange = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL,
      numRows, 1);
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  approvalColumnRange.setDataValidation(rule);
  approvalColumnRange.setValue('IN PROGRESS');

  // adds new notified column
  sheet.insertColumnAfter(COLUMN_NUMBER.APPROVAL); // global
  sheet.getRange(1, COLUMN_NUMBER.APPROVAL + 1).setValue('NOTIFIED STATUS');

  // make sure notified column is all drop-down menus
  var notifiedColumnRange = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL
      + 1, numRows, 1);
  dropdownValues = ['NOTIFIED', 'NOT NOTIFIED'];
  rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  notifiedColumnRange.setDataValidation(rule);
  notifiedColumnRange.setValue('NOT NOTIFIED');
}

/** Runs the script "Send Emails". Sends e mails to every employee notifying
 * them whether or not their timesheet has been approved.  Checks + updates
 * "NOTIFIED" status so employers do not send e mails more than once.
*/
function sendEmails() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  // lastCol here is the NOTIFIED column
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // gets ranges of values all at once
  var emailValues = sheet.getRange(beginningRow, COLUMN_NUMBER.EMAIL, numRows, 1).getValues();
  var approvalValues = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL,
      lastRow - frozenRows, 1).getValues();
  var notifiedValues = sheet.getRange(beginningRow, 12, numRows,
      1).getValues();

  // goes through the whole email column
  for (var i = 0; i <= lastRow - beginningRow; i++) {
    // don't notify twice
    if (notifiedValues[i][0] == 'NOTIFIED') {
      continue;
    }
    var email = emailValues[i][0];
    var approvalValue = approvalValues[i][0];

    // approval email
    if (approvalValue == 'APPROVED') {
      var message = 'Your timesheet has been approved';
      var subject = 'TimeSheet Approval';
    } else if (approvalValue == 'NOT APPROVED') {
      var message = 'NOT APPROVED';
      var subject = 'TimeSheet not Approved';
    } else if (approvalValue == 'IN PROGRESS') {
      continue;
    }
    MailApp.sendEmail(email, subject, message);
    notifiedValues[i][0] = 'NOTIFIED';
    sheet.getRange(i + beginningRow,
        lastCol).setValue('NOTIFIED');
  }
}


