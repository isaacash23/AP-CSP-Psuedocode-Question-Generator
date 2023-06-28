function onEdit(e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getActiveSheet()

  if (sheet.getName() == 'Quiz Builder') {
    var p = createQuizPlannerSheetObject(sheet)
    p.runOnEdit(e)
  }
  else if (sheet.getName() == 'Question Template') {
    spreadsheet.toast("Please do not edit the question template")
  }
  else {
    var s = createSheetQuestionObject(sheet);
    s.runOnEdit(e)
  }
  
}

function newLineAtEnd() {
  var sheet = SpreadsheetApp.getActiveSheet()
  s = createSheetQuestionObject(sheet);
  s.addBlockAtEnd()
}

function insertPseudocodeLine() {
  var sheet = SpreadsheetApp.getActiveSheet()
  s = createSheetQuestionObject(sheet);
  s.insertPseudocodeLine()
}

function insertCodeBlock() {
  var sheet = SpreadsheetApp.getActiveSheet()
  var cell = sheet.getCurrentCell()
  s = createSheetQuestionObject(sheet)
  s.insertCodeBlock(cell)
}

function deleteLastBlock() {
  var sheet = SpreadsheetApp.getActiveSheet()
  s = createSheetQuestionObject(sheet);
  s.deleteLastBlock()
}

function newQuestionTypeSheet() {
  var sheet = SpreadsheetApp.getActiveSheet()
  p = createQuizPlannerSheetObject(sheet);
  p.createNewQuestionSheet()
}

function createQuiz() {
  var sheet = SpreadsheetApp.getActiveSheet()
  p = createQuizPlannerSheetObject(sheet);
  p.createQuiz()
}


