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

/* 
* Check for losses in the sheet.
*/
function checkLosses() {
  // Pull data from the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Calculations"
  );
  var source = sheet.getRange("A:G");
  var data = source.getValues();

  //Prepare the email alert content
  var message = "Stocks: <br><br>";

  var send_message = false;

  Logger.log("starting loop");

  //Traversing the cells in the spreadsheet to find cells where the stock fell below purchase price
  var n = 0;
  for (var i in data) {
    //Skip the first line
    if (n++ == 0) continue;

    //Load the current row
    var row = data[i];

    Logger.log(row[1]);
    Logger.log(row[6]);

    //Once at the end of the list exit the loop
    if (row[1] == "") break;

    //If value is below purchase price, add stock ticker and difference to list of tax loss opportunities
    if (row[6] < 0) {
      message +=
        row[1] +
        ": " +
        (parseFloat(row[6].toString()) * 100).toFixed(2).toString() +
        "%<br>";
      send_message = true;
    }
  }
  if (!send_message) return;

  MailApp.sendEmail({
    to: SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail(),
    subject: "Tax-loss harvest",
    htmlBody: message,
    
  });
}
