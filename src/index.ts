import {sheets, selectTempSheets, convertSheetsToCsv} from "./modules/spreadsheet";
import {run} from "./modules/util";

const getCsvJson = () => run(
  sheets(),
  selectTempSheets,
  convertSheetsToCsv,
  JSON.stringify
);

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('出力', [{
    name : 'CSVで全て出力',
    functionName : 'downloadSpreadsheet'
  }]);
};

function downloadSpreadsheet() {
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createTemplateFromFile('dialog').evaluate(),
    'Downloading...'
  );
}
