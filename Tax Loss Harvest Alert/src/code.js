/* 
When Google Finance reports a change in price to one of your stocks, 
the spreadsheet will be updated, triggering a change in the spreadsheet.
That event then triggers this function.
*/

function onChange() {
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
