import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const tempPrefix = '_tmp_';

const flatten = (array: any[]) => [].concat.apply([], array);

const run = (...funcs) => init =>
  funcs.reduce((prev, func) => func(prev), init);

const tap = func => value => {
  func(value);
  return value;
};

// ======================

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const currentSheets = () => spreadsheet.getSheets();

const getMatrix = (sheet: Sheet) => sheet.getDataRange().getValues();

// ======================

const isTemp = (sheet: Sheet) => sheet.getName().lastIndexOf(tempPrefix) === 0;

const getBaseName = (sheet: Sheet) => isTemp(sheet) ? sheet.getName().slice(tempPrefix.length) : sheet.getName();

const getTempName = (sheet: Sheet) => tempPrefix + sheet.getName();

const groupByBaseName = (sheets: Sheet[]) => sheets.reduce((carry, currentSheet) => {
  const baseName = getBaseName(currentSheet);
  (carry[baseName] = carry[baseName] || []).push(currentSheet);
  return carry;
}, {});

// =====================

const convertSheetsToCsv = (sheets: Sheet[]) =>
  sheets.map(convertSheetToCsv);

const convertSheetToCsv = (sheet: Sheet) =>
  [sheet.getName(), run(getMatrix(sheet), convertMatrixToCsv)];

const convertMatrixToCsv = (matrix: any[][]) =>
  matrix.map(row => row.join(',')).join('\r\n');

// =====================

const generateTempSheet = (sheet: Sheet) => {
  if (isTemp(sheet)) {
    return;
  }
  sheet.activate();
  spreadsheet.duplicateActiveSheet().setName(getTempName(sheet)).activate();
  spreadsheet.moveActiveSheet(spreadsheet.getNumSheets());
};

const generateTempSheets = (sheets: Sheet[]) => sheets.map(generateTempSheet);

// =====================

const deleteTempSheets = (sheets: Sheet[]) => sheets.forEach(sheet => isTemp(sheet) && spreadsheet.deleteSheet(sheet));

// ======================

const calcDifference = (groupedSheets: {[baseName: string]: [Sheet, Sheet]}) => Object.keys(groupedSheets).map(baseName =>
  groupedSheets[baseName].length === 2 ? compareSheets(groupedSheets[baseName][0], groupedSheets[baseName][1]) : null
);

const compareSheets = (sheet1: Sheet, sheet2: Sheet) => compareMatrix(getMatrix(sheet1), getMatrix(sheet2));

const compareMatrix = (matrix1: any[][], matrix2: any[][]) =>
  matrix1.map((row, index) => matrix2[index] ? compareRow(row, matrix2[index]) : [row, null]);

const compareRow = (row1: any[], row2: any[]) =>
  row1.join(',') !== row2.join(',') ? [row1, row2] : null;

// ======================

function getDifference() {
  return run(
    groupByBaseName,
    calcDifference
  )(currentSheets());
}

function executeGeneration() {
  return run(
    deleteTempSheets,
    generateTempSheets,
    convertSheetsToCsv
  )(currentSheets());
}

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
