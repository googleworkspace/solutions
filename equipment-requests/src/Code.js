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

var REQUEST_NOTIFICATION_EMAIL = 'sbazyl@google.com';

// Form field titles, used for creating the form and as keys when handling
// responses.
/**
 * Add custom menu items when opening the sheet.
 */
function onOpen() {
  var menu = SpreadsheetApp.getUi().createMenu('Equipment requests')
      .addItem('Set up', 'setup_')
      .addItem('Clean up', 'cleanup_')
      .addToUi();
}

/**
 * Set up the form and triggers for the workflow.
 */
function setup_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getFormUrl()) {
    var msg = 'Form already exists. Unlink the form and try again.';
    SpreadsheetApp.getUi().alert(msg);
    return;
  }
  var form = FormApp.create('Equipment Requests')
      .setCollectEmail(true)
      .setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId())
      .setLimitOneResponsePerUser(false);
  var availableLaptops = [
    '15" high Performance Laptop (OS X)',
    '15" high Performance Laptop (Windows)',
    '15" high performance Laptop (Linux)',
    '13" lightweight laptop (Windows)',
  ];
  var availableDesktops = [
    'Standard workstation (Windows)',
    'Standard workstation (Linux)',
    'High performance workstation (Windows)',
    'High performance workstation (Linux)',
    'Mac Pro (OS X)',
  ];
  var availableMonitors = [
    'Single 27"',
    'Single 32"',
    'Dual 24"',
  ];

  form.addTextItem().setTitle('Employee name').setRequired(true);
  form.addTextItem().setTitle('Desk location').setRequired(true);
  form.addDateItem().setTitle('Due date').setRequired(true);
  form.addListItem().setTitle('Laptop').setChoiceValues(availableLaptops);
  form.addListItem().setTitle('Desktop').setChoiceValues(availableDesktops);
  form.addListItem().setTitle('Monitor').setChoiceValues(availableMonitors);

  var sheets = ss.getSheets().forEach(function(sheet) {
    if (sheet.getFormUrl() == ss.getFormUrl()) {
      sheet.hideSheet();
    }
  });
  // Start workflow on each form submit
  ScriptApp.newTrigger('onFormSubmit_')
      .forForm(form)
      .onFormSubmit()
      .create();
  // Archive completed items every 30m.
  ScriptApp.newTrigger('processCompletedItems_')
      .timeBased()
      .everyMinutes(5)
      .create();
}

/**
 * Cleans up the project (stop triggers, form submission, etc.)
 */
function cleanup_() {
  var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
  if (!formUrl) {
    return;
  }
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    ScriptApp.deleteTrigger(trigger);
  });
  var form = FormApp.openByUrl(formUrl)
      .deleteAllResponses()
      .setAcceptingResponses(false);
}

/**
 * Handle new form submissions to trigger the workflow.
 *
 * @param {Object} event - Form submit event
 */
function onFormSubmit_(event) {
  var response = mapResponse_(event.response);
  sendNewEquipmentRequestEmail_(response);
  var equipmentDetails = Utilities.formatString('%s\n%s\n%s',
      response['Laptop'],
      response['Desktop'],
      response['Monitor']);
  var row = ['New',
    '',
    response['Desk location'],
    response['Employee name'],
    response['Desk location'],
    equipmentDetails,
    response['email']];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Pending requests');
  sheet.appendRow(row);
}

/**
 * Sweeps completed events, notifying the requestors and archiving them
 * to the completed
 *
 * @param {Object} event
 */
function processCompletedItems_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pending = ss.getSheetByName('Pending requests');
  var completed = ss.getSheetByName('Completed requests');
  var rows = pending.getDataRange().getValues();
  rows.forEach(function(row, index) {
    var status = row[0];
    if (status === 'Completed' || status == 'Cancelled') {
      pending.deleteRow(index + 1);
      completed.appendRow(row);
      sendEquipmentRequestCompletedEmail_({
        'Employee name': row[3],
        'Desk location': row[4],
        'email': row[6],
      });
    }
  });
}

/**
 * Sends email notifying team a new equipment request has been submitted.
 *
 * @param {Object} request - Request details
 */
function sendNewEquipmentRequestEmail_(request) {
  var template = HtmlService.createTemplateFromFile('new-equipment-request.html');
  template.request = request;
  template.sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  var msg = template.evaluate();
  GmailApp.sendEmail(REQUEST_NOTIFICATION_EMAIL, 'New equipment request', msg.getContent(), {
    htmlBody: msg.getContent(),
  });
}

/**
 * Sends email notifying requestor that the equipment has been provided.
 *
 * @param {Object} request - Request details
 */
function sendEquipmentRequestCompletedEmail_(request) {
  var template = HtmlService.createTemplateFromFile('request-complete.html');
  template.request = request;
  var msg = template.evaluate();
  GmailApp.sendEmail(request.email, 'Equipment request completed', msg.getContent, {
    htmlBody: msg.getContent(),
  });
}

/**
 * Converts a form response to an object keyed by the item titles. Allows easier
 * access to response values.
 *
 * @param {FormResponse} response
 * @return {Object} Form values keyed by question title
 */
function mapResponse_(response) {
  var initialValue = {
    email: response.getRespondentEmail(),
    timestamp: response.getTimestamp(),
  };
  return response.getItemResponses().reduce(function(obj, itemResponse) {
    var key = itemResponse.getItem().getTitle();
    obj[key] = itemResponse.getResponse();
    return obj;
  }, initialValue);
}

