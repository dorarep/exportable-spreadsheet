const sheets = () => {
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  return {
    names: () => sheets.map(sheet => sheet.getName())
  }
};

function myFunction() {
  Logger.log(sheets().names());
}
