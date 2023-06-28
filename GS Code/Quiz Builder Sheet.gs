// This object manages the data the user inputs on the "quiz builder" sheet, and turns that into a google form quiz

class QuizPlannerSheet {
  constructor(sheet) {
    this.sheet = sheet
    this.spreadsheet = this.sheet.getParent()
  }

  // Gets the name of the questions from the other sheets
  getQuestionNames() {
    var names = ["",]
    for (var sheet of this.spreadsheet.getSheets()) {
      names.push(sheet.getName())
    }
    names = removeElement(names,this.sheet.getName())
    names = removeElement(names,"Question Template")
    return names
  }

  // Creates a dropdown menu of the different question names from the other sheets in the spreadsheet
  createQuestionMenu(row,col=1) {
    var cell = this.sheet.getRange(row,col)
    createDropdownMenu(cell,this.getQuestionNames())
  }

  // Updates the dropdown menus when a new question type is made or renamed
  updateQuestionNamesDropdown(startRow = 2, col=1) {
    var lastRow = startRow-1
    var columnCellsRange = this.sheet.getRange(startRow,col,this.sheet.getLastRow()-startRow+1,1)
    var columnCells = columnCellsRange.getValues()[0]
    for (let cell in columnCells) {
      if (columnCells[cell]) {
        lastRow = cell+2
      }
    }
    columnCellsRange.clearDataValidations()
    var menuCells = this.sheet.getRange(startRow,col,lastRow-startRow+3)
    var dropDownMenu = SpreadsheetApp.newDataValidation().requireValueInList(this.getQuestionNames()).build();
    menuCells.setDataValidation(dropDownMenu);
  }

  // Creates a google form based on the question types the user has chosen, and returns that form
  createQuiz() {
    var quizName = this.sheet.getRange(2,5).getValue()
    if (! quizName) {
      quizName = `Quiz ${getRandomInteger(1000,9999)}`
    }
    var form = FormApp.create(quizName)
    form.setIsQuiz(true)
    form.setCollectEmail(true)

    var startingQuestionRow = 2
    var questionColumn = 1

    // Get the question types the user has chosen, and how many of each of those questions they want
    var questionTypesAndFrequencies = this.sheet.getRange(startingQuestionRow,questionColumn,this.sheet.getLastRow()-startingQuestionRow,2).getValues()
    
    for (const [sheetName, numQuestions] of questionTypesAndFrequencies) {
      if (!sheetName) {
        continue
      }
      var questionSheet = this.spreadsheet.getSheetByName(sheetName)
      var sheetQuestionObject = new SheetQuestion(questionSheet)
      var questionObject = sheetQuestionObject.exportToQuestionObject()

      for (let i = 0; i < numQuestions; i++) {
        questionObject.createMCQuestion(form)
      }
    }

    var editUrlCell = [10,5]
    this.sheet.getRange(editUrlCell[0],editUrlCell[1]).setValue(form.getEditUrl())

    var studentUrlCell = [8,5]
    this.sheet.getRange(studentUrlCell[0],studentUrlCell[1]).setValue(form.getPublishedUrl())

    return form
  }

  // Create a new blank question sheet to build a pseudocode outline in
  createNewQuestionSheet() {
    var spreadsheet = this.sheet.getParent()
    var templateSheet = spreadsheet.getSheetByName("Question Template")
    var newSheet = spreadsheet.insertSheet(`Question ${getRandomInteger(1000,9999)}`,spreadsheet.getNumSheets(),{template: templateSheet})
  }

  // Code to run whenever the user edits the sheet
  runOnEdit(e) {
    var row = e.range.getRow()
    var col = e.range.getColumn()
    
    if (col==1) {
      var questionNamesColumn = this.sheet.getRange(2,1,row,1)
      var dropDownMenu = SpreadsheetApp.newDataValidation().requireValueInList(this.getQuestionNames()).build();
      questionNamesColumn.setDataValidation(dropDownMenu);
    }
  }

}

function createQuizPlannerSheetObject(sheet) {
  return new QuizPlannerSheet(sheet)
}
