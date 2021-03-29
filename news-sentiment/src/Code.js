// Copyright 2021 Google LLC
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

// Global variables
const googleAPIKey = 'YOUR_GOOGLE_API_KEY';
const newsApiKey = 'YOUR_NEWS_API_KEY';
const apiEndPointHdr = 'https://newsapi.org/v2/everything?q=';
const happyFace =
  '=IMAGE(\"https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635449_1280.png\")';
const mehFace =
  '=IMAGE(\"https://cdn.pixabay.com/photo/2016/09/01/08/24/smiley-1635450_1280.png\")';
const sadFace =
  '=IMAGE(\"https://cdn.pixabay.com/photo/2016/09/01/08/25/smiley-1635454_1280.png\")';
const happyColor = '#44f83d';
const mehColor = '#f7f6cc';
const sadColor = '#ff3c3d';
const fullsheet = 'A2:D25';
const sentimentCols = 'B2:D25';
const articleMax = 20;
const threshold = 0.3;

let headlines = [];
let rows = null;
let rowValues = null;
let topic = null;
let bottomRow = 0;
let ds = null;
let ss = null;
let headerRow = null;
let sentimentCol = null;
let headlineCol = null;
let scoreCol = null;

/**
 * Create menu in the Google Spreadsheet when Spreadsheet is opened.
 * 
 */
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('News Headlines Sentiments')
    .addItem('Analyze News Headlines...', 'showNewsPrompt')
    .addToUi();
}

/**
 * Prompt user to enter a new headline topic. 
 * Calls main function AnalyzeHeadlines with entered topic.
 */
function showNewsPrompt() {
  //Initialize global variables
  ss = SpreadsheetApp.getActiveSpreadsheet();
  ds = ss.getSheetByName('Sheet1');
  headerRow = ds.getDataRange().getValues()[0];
  sentimentCol = headerRow.indexOf('Sentiment');
  headlineCol = headerRow.indexOf('Headlines');
  scoreCol = headerRow.indexOf('Score');

  // Build Menu
  let ui = SpreadsheetApp.getUi();
  let result = ui.prompt(
    'Enter news topic:',
    ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  let button = result.getSelectedButton();
  topic = result.getResponseText();
  if (button == ui.Button.OK) {
    analyzeNewsHeadlines();
  } else if (button == ui.Button.CANCEL) {
    // User clicked "Cancel".
    ui.alert('News topic not selected!');
  }
}

/**
 * For each headline cell, call NL API to get general sentiment and then update 
 * sentiment response column.
 */
function analyzeNewsHeadlines() {
  // Clear and reformat sheet
  reformatSheet();

  // Get headlines array
  headlines = getHeadlinesArray();

  // Sync headlines array to sheet using single setValues call 
  if (headlines.length > 0){
    ds.getRange(2, 1, headlines.length, headlineCol+1).setValues(headlines);
    // Set global rowValues
    rows = ds.getDataRange();
    rowValues = rows.getValues();
    getSentiments();
  } else {
    ss.toast("No headlines returned for topic: " + topic + '!');
  }
}

/**
 * Fetch current headlines from the Free News API
 */
function getHeadlinesArray() {
  // Fetch headlines for a given topic
  let hdlnsResp = [];
  let encodedtopic = encodeURIComponent(topic);
  ss.toast("Getting headlines for: " + topic);
  let response = UrlFetchApp.fetch(apiEndPointHdr + encodedtopic + '&apiKey=' +
    newsApiKey);
  let results = JSON.parse(response);
  let articles = results["articles"];

  for (let i = 0; i < articles.length && i < articleMax; i++) {
    let newsStory = articles[i]['title'];
    if (articles[i]['description'] !== null) {
      newsStory += ': ' + articles[i]['description'];
    }
    // Scrub newsStory of invalid characters
    newsStory = scrub(newsStory);

    // Construct hdlnsResp as a 2d array. This simplifies syncing to sheet.
    hdlnsResp.push(new Array(newsStory));
  }

  return hdlnsResp;
}

/**
 * For each article cell, call NL API to get general sentiment and then update 
 * sentiment response columns.
 */
function getSentiments() {
  ss.toast('Analyzing the headline sentiments...');

  let articleCount = rows.getNumRows() - 1;
  let avg = 0;

  // Get sentiment for each row 
  for (let i = 1; i <= articleCount; i++) {
    let headlineCell = rowValues[i][headlineCol];
    if (headlineCell) {
      let sentimentData = retrieveSentiment(headlineCell);
      let result = sentimentData['documentSentiment']['score'];
      avg += result;
      ds.getRange(i + 1, sentimentCol + 1).setBackgroundColor(getColor(result));
      ds.getRange(i + 1, sentimentCol + 1).setValue(getFace(result));
      ds.getRange(i + 1, scoreCol + 1).setValue(result);
    }
  }
  let avgDecimal = (avg / articleCount).toFixed(2);
 
  // Show news topic and average face, color and sentiment value.
  bottomRow = articleCount + 3;
  ds.getRange(bottomRow, 1, headlines.length, scoreCol+1).setFontWeight('bold');
  ds.getRange(bottomRow, headlineCol + 1).setValue('Topic: \"' + topic + '\"');
  ds.getRange(bottomRow, headlineCol + 2).setValue('Avg:');
  ds.getRange(bottomRow, sentimentCol + 1).setValue(getFace(avgDecimal));
  ds.getRange(bottomRow, sentimentCol + 1).setBackgroundColor(getColor(avgDecimal));
  ds.getRange(bottomRow, scoreCol + 1).setValue(avgDecimal);
  ss.toast("Done!!");
}

/**
 * Call NL API to get sentiment response for headline.
 * 
 * Important note: Not all languages are supported by Google document 
 * sentiment analysis. 
 * Unsupported languages generate a "400" response: "INVALID_ARGUMENT".
 */
function retrieveSentiment(text) {
  // Set REST call options   
  let apiEndPoint =
    'https://language.googleapis.com/v1/documents:analyzeSentiment?key=' +
    googleAPIKey;
  let jsonReq = JSON.stringify({
    document: {
      type: "PLAIN_TEXT",
      content: text
    },
    encodingType: "UTF8"
  });

  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': jsonReq
  }

  //  Make the REST call
  let response = UrlFetchApp.fetch(apiEndPoint, options);
  let responseData = JSON.parse(response);
  return responseData;
}

// Helper Functions 

/**
 * Remove old headlines, sentiments and reset formatting
 */
function reformatSheet() {
  let range = ds.getRange(fullsheet);
  range.clearContent();
  range.clearFormat();
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

  range = ds.getRange(sentimentCols); // Center the sentiment cols only
  range.setHorizontalAlignment("center");
}

/**
 * Return a corresponding face based on numeric value.
 */
function getFace(value){
  if (value >= threshold) {
    return happyFace;
  } else if (value < threshold && value > -threshold){
    return mehFace;
  } else if (value <= -threshold) {
   return sadFace;
  }
}

/**
 * Return a corresponding color based on numeric value.
 */
function getColor(value){
  if (value >= threshold) {
    return happyColor;
  } else if (value < threshold && value > -threshold){
    return mehColor;
  } else if (value <= -threshold) {
   return sadColor;
  }
}

/**
 * Scrub invalid characters out of headline text.
 * Can be expanded if needed.
 */
function scrub(text) {
  return text.replace(/[\‘\,\“\”\"\'\’\-\n\â\]/g, ' ');
}