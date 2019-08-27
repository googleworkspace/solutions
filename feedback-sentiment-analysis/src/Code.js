// Sets API key for accessing Cloud Natural Language API.
var myApiKey = "YOUR_API_KEY_HERE";

// Matches column names in Review Data sheet to variables.
var COLUMN_NAME = {
  COMMENTS: 'comments',
  LANGUAGE: 'language_detected',
  TRANSLATION: 'comments_english',
  ENTITY: 'entity_sentiment',
  ID: 'id'
};

/**
 * Creates a Demo menu in Google Spreadsheets.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Demo Tools')
    .addItem('Mark entities and sentiment', 'markEntitySentiment')
    .addToUi();
};

/**
* Analyzes entities and sentiment for each comment in  
* Review Data sheet and copies results into the 
* Entity Sentiment Data sheet.
*/
function markEntitySentiment() {
  // Sets variables for "Review Data" sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName('Review Data');
  var rows = dataSheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  var headerRow = values[0];
  
  // Checks to see if "Entity Sentiment Data" sheet is present, and
  // if not, creates a new sheet and sets the header row.
  var entitySheet = ss.getSheetByName('Entity Sentiment Data');
  if (entitySheet == null) {
   ss.insertSheet('Entity Sentiment Data');
   var entitySheet = ss.getSheetByName('Entity Sentiment Data');
   var esHeaderRange = entitySheet.getRange(1,1,1,6);
   var esHeader = [['Review ID','Entity','Salience','Sentiment Score',
                    'Sentiment Magnitude','Number of mentions']];
   esHeaderRange.setValues(esHeader);
  };
  
  // Finds the column index for comments, language_detected, 
  // and comments_english columns.
  var translationColumnIdx = headerRow.indexOf(COLUMN_NAME.TRANSLATION);
  var entityColumnIdx = headerRow.indexOf(COLUMN_NAME.ENTITY);
  var idColumnIdx = headerRow.indexOf(COLUMN_NAME.ID);
  if (entityColumnIdx == -1) {
    Browser.msgBox("Error: Could not find the column named " + COLUMN_NAME.ENTITY + 
                   ". Please create and empty column with header \"entity_sentiment\" on the Review Data tab.");
    return; // bail
  };
  
  ss.toast("Analyzing entities and sentiment...");
  for (var i = 0; i < numRows; ++i) {
    var value = values[i];
    var commentEnCellVal = value[translationColumnIdx];
    var entityCellVal = value[entityColumnIdx];
    var reviewId = value[idColumnIdx];
    
    // Calls retrieveEntitySentiment function for each row that has a comment 
    // and also an empty entity_sentiment cell value.
    if(commentEnCellVal && !entityCellVal) {
        var nlData = retrieveEntitySentiment(commentEnCellVal);
        // Pastes each entity and sentiment score into Entity Sentiment Data sheet.
        var newValues = []
        for each (var entity in nlData.entities) {
          var row = [reviewId, entity.name, entity.salience, entity.sentiment.score, 
                     entity.sentiment.magnitude, entity.mentions.length
                    ];
          newValues.push(row);
        }
      if(newValues.length) {
        entitySheet.getRange(entitySheet.getLastRow() + 1, 1, newValues.length, newValues[0].length).setValues(newValues);
      }
        // Pastes "complete" into entity_sentiment column to denote completion of NL API call.
        dataSheet.getRange(i+1, entityColumnIdx+1).setValue("complete");
     }
   }
};

/**
 * Calls the Cloud Natural Language API with a string of text to analyze
 * entities and sentiment present in the string.
 * @param {String} the string for entity sentiment analysis
 * @return {Object} the entities and related sentiment present in the string
 */
function retrieveEntitySentiment (line) {
  var apiKey = myApiKey;
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:analyzeEntitySentiment?key=' + apiKey;
  // Creates a JSON request, with text string, language, type and encoding
  var nlData = {
    document: {
      language: 'en-us',
      type: 'PLAIN_TEXT',
      content: line
    },
    encodingType: 'UTF8'
  };
  // Packages all of the options and the data together for the API call.
  var nlOptions = {
    method : 'post',
    contentType: 'application/json',  
    payload : JSON.stringify(nlData)
  };
  // Makes the API call.
  var response = UrlFetchApp.fetch(apiEndpoint, nlOptions);
  return JSON.parse(response);
};
