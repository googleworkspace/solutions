// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
 
// Global variables representing the index of certain columns.
var COLUMN_NUMBER = {
  EMAIL: 3,
  HOURS_START: 4,
  HOURS_END: 8,
  HOURLY_PAY: 9,
  CALC_PAY: 10,
  APPROVAL: 11,
};

/**
* Creates the menu item "Timesheets" so user can run scripts on drop-down.
*/
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Timesheets')
        .addItem('Column Setup', 'columnSetup')
        .addItem('Calculate Pay', 'calculatePay')
        .addItem('Send Emails', 'sendEmails')
        .addToUi();
}

/**
* Runs the "Column Setup" script, adding an "APPROVAL" column at the end of the sheet, 
* containing drop-down menus to either approve/disapprove employee timesheets.
* Adds "NOTIFIED STATUS" column indicating whether or not an employee has yet been e mailed.
*/
function columnSetup() { 
  // defines variables
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var frozenRows = sheet.getFrozenRows();

  // adds new calculate pay column
  sheet.insertColumnAfter(COLUMN_NUMBER.HOURLY_PAY);
  var weeklyPayColumn = sheet.getRange(1, COLUMN_NUMBER.CALC_PAY).setValue('WEEKLY PAY');
  
  // adds new approval column
  sheet.insertColumnAfter(COLUMN_NUMBER.CALC_PAY);
  var approvalColumn = sheet.getRange(1, COLUMN_NUMBER.APPROVAL).setValue('APPROVAL');

  // make sure approval column is all drop-down menus
  var bigRange = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.APPROVAL, lastRow - frozenRows, 1);  
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues).build();
  bigRange.setDataValidation(rule);
  bigRange.setValue('IN PROGRESS');
  
  // adds new notified column
  sheet.insertColumnAfter(COLUMN_NUMBER.APPROVAL); //global
  var notifiedColumn = sheet.getRange(1, COLUMN_NUMBER.APPROVAL + 1).setValue('NOTIFIED STATUS'); 
  
  // make sure notified column is all drop-down menus
  bigRange = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.APPROVAL + 1, lastRow - frozenRows, 1);
  dropdownValues = ['NOTIFIED', 'NOT NOTIFIED'];
  rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues).build();
  bigRange.setDataValidation(rule);
  bigRange.setValue('NOT NOTIFIED');
}

/**
* Runs the "Calculate Pay" script, creating a new column with each employee's 
* pay based on their reported hours and hourly wage.
*/
function calculatePay() {
  // declares variables
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var frozenRows = sheet.getFrozenRows();
 
  // gets hours & hourly rate values
  var rangeValues = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.HOURS_START, lastRow - frozenRows, 6).getValues();
  var pays = [];
  
  // goes through every employee
  for (var i = 0; i <= lastRow - (frozenRows + 1); i++) {
    var numHours = 0;
    for (var j = 0; j < 5; j++) {
      numHours += rangeValues[i][j];
    
    // pushes weekly pay value into 2D array
    pays.push([numHours * sheet.getRange(i + (frozenRows + 1), COLUMN_NUMBER.HOURLY_PAY).getValue()]);
  
  // pushes entire 2D array of pay values into column 
  var pushRange = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.CALC_PAY, lastRow - 1, 1).setValues(pays);
}

/**
* Runs the script "Send Emails". Sends e mails to every employee notifying 
* them whether or not their timesheet has been approved.
* Checks + updates "NOTIFIED" status so employers do not send e mails more than once.
*/
function sendEmails() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    // lastCol here is the NOTIFIED column
    var frozenRows = sheet.getFrozenRows();
  
    // gets ranges of values all at once
    var emailValues = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.EMAIL, lastRow - frozenRows, 1).getValues();
    var approvalValues = sheet.getRange(frozenRows + 1, COLUMN_NUMBER.APPROVAL, lastRow - frozenRows, 1).getValues();
    var notifiedValues = sheet.getRange(frozenRows + 1, lastCol, lastRow - frozenRows, 1).getValues();
  
    // goes through the whole email column
    for (var i = 0; i <= lastRow - (frozenRows + 1); i++) { 
      // don't notify twice
      if (notifiedValues[i][0] == 'NOTIFIED') {
        continue;
      
           
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
      var notifiedUpdate = sheet.getRange(i, lastCol).setValue('NOTIFIED');
    
}




