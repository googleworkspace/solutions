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
  EMAIL: 2,
  HOURS_START: 4,
  HOURS_END: 8,
  HOURLY_PAY: 9,
  CALC_PAY: 10,
  APPROVAL: 11,
  NOTIFY: 12,
};

// Global variables:
var APPROVED_EMAIL_SUBJECT = 'Weekly Timesheet APPROVED';
var REJECTED_EMAIL_SUBJECT = 'Weekly Timesheet NOT APPROVED';
var APPROVED_EMAIL_MESSAGE = 'Your timesheet has been approved.';
var REJECTED_EMAIL_MESSAGE = 'Your timesheet has not been approved.';

/** 
 * Creates the menu item "Timesheets" for user to run scripts on drop-down.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Timesheets')
      .addItem('Column Setup', 'columnSetup')
      .addItem('Notify Employees', 'checkApprovedStatusToNotify')
      .addToUi();
}

/** 
 * Adds "WEEKLY PAY" column with calculated values using array formulas. 
 * Adds an "APPROVAL" column at the end of the sheet, containing 
 * drop-down menus to either approve/disapprove employee timesheets.  
 * Adds a "NOTIFIED STATUS" column indicating whether or not an
 * employee has yet been e mailed.
 */
function columnSetup() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // Calls helper functions to add new columns.
  addCalculatePayColumn(sheet, beginningRow);
  addApprovalColumn(sheet, beginningRow, numRows);
  addNotifiedColumn(sheet, beginningRow, numRows);
}

/**
 * Adds a CALCULATE PAY column and automatically calculates
 * every employee's weekly pay.
 *
 * @param {Object} sheet Spreadsheet object of current sheet.
 * @param {Integer} beginningRow Index of beginning row.
 */
function addCalculatePayColumn(sheet, beginningRow) {
  sheet.insertColumnAfter(COLUMN_NUMBER.HOURLY_PAY);
  sheet.getRange(1, COLUMN_NUMBER.CALC_PAY).setValue('WEEKLY PAY');

  // Calculates weekly pay using array formulas.
  sheet.getRange(beginningRow, COLUMN_NUMBER.CALC_PAY)
      .setFormula('=ArrayFormula(SUM(D2:H2) * I2:I)');
}

/**
 * Adds an APPROVAL column allowing managers to approve/
 * disapprove of each employee's timesheet.
 *
 * @param {Object} sheet Spreadsheet object of current sheet.
 * @param {Integer} beginningRow Index of beginning row.
 * @param {Integer} numRows Number of rows currently in use.
 */
function addApprovalColumn(sheet, beginningRow, numRows) {
  sheet.insertColumnAfter(COLUMN_NUMBER.CALC_PAY);
  sheet.getRange(1, COLUMN_NUMBER.APPROVAL).setValue('APPROVAL');

  // Make sure approval column is all drop-down menus.
  var approvalColumnRange = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL,
      numRows, 1);
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  approvalColumnRange.setDataValidation(rule);
  approvalColumnRange.setValue('IN PROGRESS');
}

/**
 * Adds a NOTIFIED column allowing managers to see which employees
 * have/have not yet been notified of their approval status.
 *
 * @param {Object} sheet Spreadsheet object of current sheet.
 * @param {Integer} beginningRow Index of beginning row.
 * @param {Integer} numRows Number of rows currently in use.
 */
function addNotifiedColumn(sheet, beginningRow, numRows) {
  sheet.insertColumnAfter(COLUMN_NUMBER.APPROVAL); // global
  sheet.getRange(1, COLUMN_NUMBER.APPROVAL + 1).setValue('NOTIFIED STATUS');

  // Make sure notified column is all drop-down menus.
  var notifiedColumnRange = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL
      + 1, numRows, 1);
  dropdownValues = ['NOTIFIED', 'PENDING'];
  rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues)
      .build();
  notifiedColumnRange.setDataValidation(rule);
  notifiedColumnRange.setValue('PENDING');  
}

/**
 * Sends a notification email to employees, with the
 * appropriate approval/disapproval subject and message.
 *
 * @param {String} email Employee's email.
 * @param {String} emailSubject Appropriate email subject line regarding
 * whether or not employee's timesheet has been approved.
 * @param {String} emailMessage Appropriate email message body regarding
 * whether or not employee's timesheet has been approved.
 */
function notify(email, emailSubject, emailMessage) {
    MailApp.sendEmail(email, emailSubject, emailMessage);
}

/**
 * Sets the notification status to NOTIFIED for employees
 * who have received a notification email.
 *
 * @param {Object} sheet Current Spreadsheet.
 * @param {Object} notifiedValues Array of notified values.
 * @param {Integer} i Current status in the for loop.
 * @parma {Integer} beginningRow Row where iterations began.
 */
function updateNotifiedStatus(sheet, notifiedValues, i, beginningRow) {
  // Update notification status.
  notifiedValues[i][0] = 'NOTIFIED';
  sheet.getRange(i + beginningRow, COLUMN_NUMBER.NOTIFY).setValue('NOTIFIED');
}

/** 
 * Checks the approval status of every employee, and calls helper functions
 * to notify employees via email & update their notification status.
 */
function checkApprovedStatusToNotify() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  // lastCol here is the NOTIFIED column.
  var frozenRows = sheet.getFrozenRows();
  var beginningRow = frozenRows + 1;
  var numRows = lastRow - frozenRows;

  // Gets ranges of email, approval, and notified values for every employee.
  var emailValues = sheet.getRange(beginningRow, COLUMN_NUMBER.EMAIL, numRows, 1).getValues();
  var approvalValues = sheet.getRange(beginningRow, COLUMN_NUMBER.APPROVAL,
      lastRow - frozenRows, 1).getValues();
  var notifiedValues = sheet.getRange(beginningRow, COLUMN_NUMBER.NOTIFY, numRows,
      1).getValues();

  // Traverses through employee's row.
  for (var i = 0; i < numRows; i++) {
    // Do not notify twice.
    if (notifiedValues[i][0] == 'NOTIFIED') {
      continue;
    }
    var email = emailValues[i][0];
    var approvalValue = approvalValues[i][0];

    // Sends notifying emails & update status.
    if (approvalValue == 'IN PROGRESS') {
      continue;
    } else if (approvalValue == 'APPROVED') {
      notify(email, APPROVED_EMAIL_SUBJECT, APPROVED_EMAIL_MESSAGE);
      updateNotifiedStatus(sheet, notifiedValues, i, beginningRow);
    } else if (approvalValue == 'NOT APPROVED') {
      notify(email,REJECTED_EMAIL_SUBJECT, REJECTED_EMAIL_MESSAGE);
      updateNotifiedStatus(sheet, notifiedValues, i, beginningRow);
    }  
  }
}
