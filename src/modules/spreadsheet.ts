import { flatten, run } from './util';

import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

const tempSuffix = '_tmp';

export const sheets = () => SpreadsheetApp.getActiveSpreadsheet().getSheets();

export const selectTempSheets = (sheets: Sheet[]) =>
  flatten(sheets.map(hasSuffix(tempSuffix)));

export const convertSheetsToCsv = (sheets: Sheet[]) =>
  sheets.map(convertSheetToCsv);

const names = (sheets: Sheet[]) => sheets.map(sheet => sheet.getName());

const hasSuffix = (suffix: string) => (sheet: Sheet) =>
  sheet.getName().lastIndexOf(suffix) === sheet.getName().length ? [sheet] : [];

const convertSheetToCsv = (sheet: Sheet) =>
  run(getMatrix(sheet), convertMatrixToCsv);

const getMatrix = (sheet: Sheet) => sheet.getDataRange().getValues();

const convertMatrixToCsv = (matrix: any[][]) =>
  matrix.map(row => row.join(',')).join('\r\n');
