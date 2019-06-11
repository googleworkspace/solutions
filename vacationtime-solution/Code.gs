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

// GLOBALS
var APPROVAL_COLUMN = 9;
var NOTIFIED_COLUMN = 10;
var EMAIL_COLUMN = 2;
var NAME_COLUMN = 3;
var START_DATE = 6;
var END_DATE = 7;
var MANAGER_EMAIL = 4;
    
/** 
* Creates menu items to run scripts.
*/
function onOpen() {
  var sheetUi = SpreadsheetApp.getUi();
  sheetUi.createMenu('TimeOff')
      .addItem('Manager Approval', 'managerApproval')
      .addItem('Notify Employees', 'notifyEmployees')
      .addToUi();
}

/** 
* SCRIPT: Add manager approval column with drop-down options.
*/
function managerApproval() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  sheet.insertColumnAfter(lastCol);
  var setTitle = sheet.getRange(1, APPROVAL_COLUMN).setValue('APPROVAL');
  
  // set drop down menu
  var dropdownValues = ['APPROVED', 'NOT APPROVED', 'IN PROGRESS'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(dropdownValues).build();
  
  for (var i = 2; i <= lastRow; i++){
    var currentCell = sheet.getRange(i, APPROVAL_COLUMN);
    currentCell.setDataValidation(rule);
    currentCell.setValue('IN PROGRESS');
  } 
}

/** 
* SCRIPT: If vacation time is not approved, send notification e mail.
* Otherwise, create a calendar event of the approved vacation time.
* Update the approval column + status of notification to avoid double e mails.
*/
function notifyEmployees() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  // create NOTIFIED column
  sheet.insertColumnAfter(lastCol);
  var setTitle = sheet.getRange(1, NOTIFIED_COLUMN).setValue('NOTIFIED STATUS');
  var notifiedValues = ['NOTIFIED', 'NOT NOTIFIED'];
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(notifiedValues).build();
 
  for (var i = 2; i <= lastRow; i++){
    var currentCell = sheet.getRange(i, NOTIFIED_COLUMN);
    currentCell.setDataValidation(rule);
    currentCell.setValue('NOT NOTIFIED');
  }
  
  for (var i = 2; i <= lastRow; i++) {
    // don't notify twice
    var notifiedStatus = sheet.getRange(i, NOTIFIED_COLUMN).getValue();
    if (notifiedStatus == 'NOTIFIED') {
        continue;
    }
    
    var employeeEmail = sheet.getRange(i, EMAIL_COLUMN).getValue();
    var startDate = new Date(sheet.getRange(i, START_DATE).getValue());
    var endDate = new Date(sheet.getRange(i, END_DATE).getValue());
    var approvalStatus = sheet.getRange(i, APPROVAL_COLUMN).getValue();

    // deals with approval cases
    if (approvalStatus == 'NOT APPROVED') {
      var subject = 'ERR: Vacation Time NOT Approved';
      var body = 'Your vacation time from' + startDate + ' to ' + endDate + ' has NOT been approved.';
      MailApp.sendEmail(employeeEmail, subject, body);
      var setStatus = sheet.getRange(i, NOTIFIED_COLUMN).setValue('NOTIFIED');
      continue;
    } else if (approvalStatus == 'APPROVED') {
      var employeeName = sheet.getRange(i, NAME_COLUMN).getValue();
      var managerEmail = sheet.getRange(i, MANAGER_EMAIL).getValue();
      var managerCal = CalendarApp.getCalendarById(managerEmail);
      
      // create event
      var event = managerCal.createEvent('APPROVED VACATION TIME FOR ' + employeeName, startDate, endDate, {
                                         description : 'Your vacation time from ' + startDate + ' to ' + endDate + ' has been approved! Enjoy!',
                                         guests : employeeEmail,
                                         sendInvites : true
                                         });
      var setStatus = sheet.getRange(i, NOTIFIED_COLUMN).setValue('NOTIFIED');

    }
  }
}


