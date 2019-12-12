/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Default values
var ACCOUNT_NAME = 'Acme';
var REGION = 'Midwest';

/**
 * Creates a slide deck of sales opportunity data from the spreadsheet.
 */
function generateReport() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Data Results');
  var dataRange = sheet.getDataRange();
  var numRows = dataRange.getNumRows();
  ACCOUNT_NAME = spreadsheet.getRangeByName('AccountName').getValue();
  REGION = spreadsheet.getRangeByName('Region').getValue();

  var presentationID = copyReportTemplate_();
  var presentation = SlidesApp.openById(presentationID);

  var slides = presentation.getSlides();
  introSlide_(slides[0], presentation);
  leadsSlide_(slides[1], sheet, presentation, numRows);

  // Create a charts sheet to delete later
  var tempSheet = spreadsheet.insertSheet('Charts Sheet', spreadsheet.getSheets().length);
  stageSlide_(slides[2], presentation, sheet, tempSheet, numRows);
  businessSlide_(slides[3], presentation, sheet, tempSheet, numRows);
  topSlide_(slides[4], sheet);
  nearSlide_(slides[5], sheet);
  needsSlide_(slides[6], sheet);

  spreadsheet.deleteSheet(tempSheet);
}

function copyReportTemplate_() {
  var date = Utilities.formatDate(new Date(), 'GMT+1', 'MM-yyyy');
  var title = ACCOUNT_NAME + ' ' + REGION + '-' + date;
  var template = DriveApp.getFileById(REPORT_SLIDES_TEMPLATE_ID);
  var driveResponse = template.makeCopy(title);
  return driveResponse.getId();
}

function introSlide_(slide, presentation) {
  slide.replaceAllText('{{ACCOUNT_NAME}}', ACCOUNT_NAME);
  slide.replaceAllText('{{REGION}}', REGION);

  var date = Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd');
  slide.replaceAllText('{{DATE}}', date);

  var imageUrl = DEFAULT_LOGO_IMAGE;
  if (ACCOUNT_NAME == 'Acme') {
    imageUrl = ACME_IMAGE;
  } else if (ACCOUNT_NAME == 'Uniket') {
    imageUrl = UNIKET_IMAGE;
  } else {
    imageUrl = GLOBAL_MEDIA_IMAGE;
  }

  try {
    var image = slide.insertImage(imageUrl, 100, 100, 100, 100);
  } catch (e) {
    var image = slide.insertImage(DEFAULT_LOGO_IMAGE, 100, 100, 100, 100);
  }

  var imgWidth = image.getWidth();
  var imgHeight = image.getHeight();
  var pageWidth = presentation.getPageWidth();
  var pageHeight = presentation.getPageHeight();
  var newX = pageWidth - imgWidth - 20;
  var newY = 20;
  image.setLeft(newX).setTop(newY);
}

function stageSlide_(slide, presentation, sheet, chartSheet, numRows) {
  var chart = sheet.newChart()
      .setChartType(Charts.ChartType.PIE)
      .addRange(sheet.getRange('F1:F' + numRows))
      .addRange(sheet.getRange('C1:C' + numRows))
      .setOption('applyAggregateData', 0)
      .setPosition(5, 5, 0, 0)
      .build();

  chartSheet.insertChart(chart);
  var chartImage = slide.insertSheetsChartAsImage(chart, 200, 200, 400, 400);
  var imgWidth = chartImage.getWidth();
  var imgHeight = chartImage.getHeight();
  var pageWidth = presentation.getPageWidth();
  var pageHeight = presentation.getPageHeight();
  var newX = pageWidth/2. - imgWidth/2.;
  var newY = pageHeight/2. - imgHeight/2.;
  chartImage.setLeft(newX).setTop(newY);
}

function businessSlide_(slide, presentation, sheet, chartSheet, numRows) {
  var chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheet.getRange('H1:H' + numRows))
      .addRange(sheet.getRange('C1:C' + numRows))
      .setOption('applyAggregateData', 0)
      .setPosition(5, 5, 0, 0)
      .build();

  chartSheet.insertChart(chart);
  var chartImage = slide.insertSheetsChartAsImage(chart, 200, 200, 400, 400);
  var imgWidth = chartImage.getWidth();
  var imgHeight = chartImage.getHeight();
  var pageWidth = presentation.getPageWidth();
  var pageHeight = presentation.getPageHeight();
  var newX = pageWidth/2. - imgWidth/2.;
  var newY = pageHeight/2. - imgHeight/2.;
  chartImage.setLeft(newX).setTop(newY);
}

function topSlide_(slide, sheet) {
  var range = sheet.getDataRange().getValues();
  var won = [];
  for (var i = 1; i < range.length; i++) {
    var row = range[i];
    if (row[5] == 'Closed Won') {
      won.push(row);
    }
  }
  won.sort(function(x, y) {
    var xp = x[2];
    var yp = y[2];
    return xp == yp ? 0 : xp < yp ? 1 : -1;
  });
  var top = [won[0], won[1], won[2]];
  for (var i = 0; i < 3; i++) {
    slide.replaceAllText('{{name'+ i +'}}', won[i][0]);
    slide.replaceAllText('{{date'+ i +'}}', won[i][4]);
    slide.replaceAllText('{{owner'+ i +'}}', won[i][9]);
  }
}

function nearSlide_(slide, sheet) {
  var range = sheet.getDataRange().getValues();
  var near = [];
  for (var i = 1; i < range.length; i++) {
    var row = range[i];
    if ((row[5] == 'Qualification' || row[5] == 'Needs Analysis'
         || row[5] == 'Negotiation') && row[6] > .5) {
      near.push(row);
    }
  }
  near.sort(function(x, y) {
    var xp = x[6];
    var yp = y[6];
    return xp == yp ? 0 : xp < yp ? 1 : -1;
  });
  var top = [near[0], near[1], near[2]];
  for (var i = 0; i < 3; i++) {
    slide.replaceAllText('{{name'+ i +'}}', near[i][0]);
    slide.replaceAllText('{{prob'+ i +'}}', near[i][6]);
    slide.replaceAllText('{{owner'+ i +'}}', near[i][9]);
  }
}

function needsSlide_(slide, sheet) {
  var range = sheet.getDataRange().getValues();
  var needs = [];
  for (var i = 1; i < range.length; i++) {
    var row = range[i];
    if ((row[5] == 'Qualification' || row[5] == 'Needs Analysis'
        || row[5] == 'Negotiation') && row[6] <.5) {
      needs.push(row);
    }
  }
  needs.sort(function(x, y) {
    var xp = x[6];
    var yp = y[6];
    return xp == yp ? 0 : xp < yp ? -1 : 1;
  });
  var top = [needs[0], needs[1], needs[2]];
  for (var i = 0; i < 3; i++) {
    slide.replaceAllText('{{name'+ i +'}}', needs[i][0]);
    slide.replaceAllText('{{prob'+ i +'}}', needs[i][6]);
    slide.replaceAllText('{{owner'+ i +'}}', needs[i][9]);
  }
}

function leadsSlide_(slide, sheet, presentation, numRows) {
  var names = sheet.getRange('J2:J' + numRows).getValues();
  names = removeDupes_(names);
  // Format the string of Owners
  var leads = names[0];
  for (var i = 1; i < names.length; i++) {
    leads = names[i] + ', ' + leads;
  }
  slide.replaceAllText('{{LEADS}}', leads);

  var imageUrl = DEFAULT_REGIONAL_IMAGE;
  if (REGION == 'Midwest') {
    imageUrl = MIDWEST_IMAGE;
  } else if (REGION == 'Northeast') {
    imageUrl = NORTHEAST_IMAGE;
  } else if (REGION == 'Southwest') {
    imageUrl = SOUTHWEST_IMAGE;
  } else if (REGION == 'West') {
    imageUrl = WEST_IMAGE;
  } else if (REGION == 'Southeast') {
    imageUrl = SOUTHEAST_IMAGE;
  }

  try {
    var image = slide.insertImage(imageUrl, 200, 200, 275, 275);
  } catch (e) {
    var image = slide.insertImage(DEFAULT_REGIONAL_IMAGE, 200, 200, 275, 275);
  }

  var imgWidth = image.getWidth();
  var imgHeight = image.getHeight();
  var pageWidth = presentation.getPageWidth();
  var pageHeight = presentation.getPageHeight();
  var newX = pageWidth/2.;
  var newY = pageHeight/2. - imgHeight/2.;
  image.setLeft(newX).setTop(newY);
}

function removeDupes_(names) {
  names = names.sort();
  var result = [names[0].toString()];
  names.forEach(function(name) {
    if (result[result.length-1].toString() != name.toString()) {
      result.push(name);
    }
  });
  return result;
}
