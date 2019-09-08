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

/** 
 * Please add your solution here if you are housing your implementation in this repo. If you 
 * are simply linking your code from another repo, please delete this file. 
 */

function onOpen() {
    "use strict";
    var menuEntries = [{
            name: "run",
            functionName: 'run'
        }],
        activeSheet;

    activeSheet = SpreadsheetApp.getActiveSpreadsheet();
    activeSheet.addMenu('myTime', menuEntries);

}

function run() {
    "use strict";
    myTime({
        mainSpreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
    }).run();
}

/* global UrlFetchApp:false */
// eslint-disable-next-line no-unused-vars
function myTime(par) {
    "use strict";
    var objectName = "myTime";
    var mainSpreadSheetId = par.mainSpreadsheetId;
    var mainSpreadsheet;
    var hourSheet;
    var codesSheet;
    var dataRange;

    function getDataRow(key) {
        var dataRow;

        dataRange.some(function (entry, index) {
            if (entry[0] === key) {
                dataRow = {
                    row: index + 1,
                    value: entry
                };
                return true;
            }
        });
        return dataRow;
    }

    function handleNewEvent(event) {
        hourSheet.appendRow([event.getId(), event.getStartTime(), event.getEndTime(), event.getTitle(), "tbd", "tbd", "tbd", event.getDescription()]);
    }

    function handleExistingEvent(event, dataRow) {

        if (event.getStartTime() - dataRow.value[1] !== 0) {
            hourSheet.getRange(dataRow.row, 2).setValue(event.getStartTime());
        }

        if (event.getEndTime() - dataRow.value[2] !== 0) {
            hourSheet.getRange(dataRow.row, 3).setValue(event.getEndTime());
        }

        if (event.getTag("Client") !== dataRow.value[4]) {
            event.setTag("Client", dataRow.value[4]);
        }

        if (event.getTag("Project") !== dataRow.value[5]) {
            event.setTag("Project", dataRow.value[5]);
        }

        if (event.getTag("Task") !== dataRow.value[6]) {
            event.setTag("Task", dataRow.value[6]);
        }

        if (event.getTitle() !== dataRow.value[4] + " " + dataRow.value[5] + " " + dataRow.value[6]) {
            if (dataRow.value[4] !== "tbd" && dataRow.value[5] !== "tbd" && dataRow.value[5] !== "tbd") {
                event.setTitle(dataRow.value[4] + " " + dataRow.value[5] + " " + dataRow.value[6]);
            }
        }

        if (event.getDescription() !== dataRow.value[7]) {
            event.setDescription(dataRow.value[7]);
        }
    }

    function formatSheet() {
        var updateRange,
            codeRange,
            rule;

        hourSheet.sort(2, false);

        updateRange = hourSheet.getRange("E2:E");
        codeRange = codesSheet.getRange("A2:A");
        rule = SpreadsheetApp.newDataValidation()
            .requireValueInRange(codeRange, true)
            .setAllowInvalid(false)
            .build();
        updateRange.setDataValidation(rule);

        updateRange = hourSheet.getRange("F2:F");
        codeRange = codesSheet.getRange("B2:B");
        rule = SpreadsheetApp.newDataValidation()
            .requireValueInRange(codeRange, true)
            .setAllowInvalid(false)
            .build();
        updateRange.setDataValidation(rule);

        updateRange = hourSheet.getRange("G2:G");
        codeRange = codesSheet.getRange("C2:C");
        rule = SpreadsheetApp.newDataValidation()
            .requireValueInRange(codeRange, true)
            .setAllowInvalid(false)
            .build();
        updateRange.setDataValidation(rule);

        updateRange = hourSheet.getRange("I2:I");
        updateRange.setFormulaR1C1("=IF(R[0]C[-6]=\"\";\"\";R[0]C[-6]-R[0]C[-7])");

        updateRange = hourSheet.getRange("J2:J");
        updateRange.setFormulaR1C1("=IF(R[0]C[-7]=\"\";\"\";month(R[0]C[-7]))");

        updateRange = hourSheet.getRange("K2:K");
        updateRange.setFormulaR1C1("=IF(R[0]C[-7]=\"\";\"\";WEEKNUM(R[0]C[-9];2))");

        updateRange = hourSheet.getRange("L2:L");
        updateRange.setFormulaR1C1("=R[0]C[-3]");
    }

    function run() {
        var startProcessDate;
        var endProcessDate;
        var calendar;
        var events;
        var currentIds = [];
        var dataRow;

        console.log("Started processing hours.");

        dataRange = hourSheet.getDataRange().getValues();
        calendar = CalendarApp.getCalendarById(mainSpreadsheet.getRangeByName("calendarId").getValue());
        startProcessDate = mainSpreadsheet.getRangeByName("startProcessDate").getValue();
        endProcessDate = new Date();

        try {
            events = calendar.getEvents(startProcessDate, endProcessDate);
            if (events.length == 0) {
                SpreadsheetApp.getUi().alert('No events were found for this period');
            }
        } catch (e) {
            SpreadsheetApp.getUi().alert('Could not get events for calendar:' + configData.calendar_id + ' starting from ' + startProcessDate);
            return;
        }

        dataRange = hourSheet.getDataRange().getValues();

        events.forEach(function (entry) {
            currentIds.push(entry.getId());
            dataRow = getDataRow(entry.getId());
            if (dataRow) {
                handleExistingEvent(entry, dataRow);
            } else {
                handleNewEvent(entry);
            }
        });

        dataRange.forEach(function (entry, index) {
            var id;

            if (index > 0 && (entry[1] instanceof Date) && (entry[1].getTime() > startProcessDate.getTime())) {
                id = entry[0];
                if (currentIds.indexOf(id) === -1 && id !== "") {
                    hourSheet.deleteRow(index + 1);
                }
            }
        });

        formatSheet();
        SpreadsheetApp.flush();
        SpreadsheetApp.setActiveSheet(hourSheet);


        console.log("Finished processing hours.");

    }

    mainSpreadsheet = SpreadsheetApp.openById(mainSpreadSheetId);
    hourSheet = mainSpreadsheet.getSheetByName("Hours");
    codesSheet = mainSpreadsheet.getSheetByName("Codes");

    return Object.freeze({
        run: run
    });
}