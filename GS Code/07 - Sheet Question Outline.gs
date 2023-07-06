// This object manages the data the user inputs in a sheet when the user makes a question outline, and exports the data into a question object

class SheetQuestion extends SheetCodeBlocks {
  constructor(sheet) {
    super(sheet)
  }

  // Gets the variable to ask about in the question from the sheet
  getVariableInQuestion() {
    var varInQuestionCell = [6,2]
    return this.sheet.getRange(varInQuestionCell[0],varInQuestionCell[1]).getValue()
  }

  // Finds the row that the pseudocode preivew is on (i.e., the end of the rows the user is inputting data into)
  getPreviewRow() {
    var firstColumn = this.sheet.getRange(1,1,this.sheet.getLastRow(),1).getValues()
    for (var row in firstColumn) {
      if (firstColumn[row][0] == 'Example Code Preview:') {
        return Number(row)+1
      }
    }
  }

  // Finds the cell that the code preview is in
  getPreviewCell() {
    return this.sheet.getRange(this.getPreviewRow()+1,1)
  }

  // Creates initial values in the code outline for all the variables
  initializeVariables() {
    var newVars = this.getVariables();
    var initialVariablesColumn = 2

    var variablesColumn = this.sheet.getRange(this.startingRow, initialVariablesColumn, this.sheet.getLastRow() - this.startingRow, 1).getValues()
    var rowsToDelete = []
    var currentRow = this.startingRow

    while (variablesColumn[currentRow-this.startingRow][0]) {
      const [currentVar] = variablesColumn[currentRow-this.startingRow]

      if (! newVars.includes(currentVar)) {
        rowsToDelete.push(currentRow)
      }
      else {
        newVars = removeElement(newVars, currentVar)
      }

      currentRow += 1
    }

    for (var newVar of newVars) {
      this.sheet.insertRows(currentRow,1)
      this.createAssignmentStatement(currentRow,1,newVar)
      this.sheet.getRange(currentRow,1).setValue("assignmentStatement")
      this.colorRow(currentRow)
      currentRow += 1
    }

    rowsToDelete.reverse()
    for (var row of rowsToDelete) {
      this.sheet.deleteRow(row)
      currentRow -= 1
    }
  }

  // Check if the user's edit changed a code block
  isCodeBlock(e) {
    var val = e.range.getValue()
    if (this.codeBlocks.includes(val)) {
      return true
    } else {
      return false
    }
  }

  // Removes any indented lines from the previous code block after it is changes
  clearOldLines(row,col) {
    var removeUpToRow = this.getPreviewRow()-1;

    // Find the next line of code at this indentation level or before, if there is one
    // Get the values farther down in the column:
    if (removeUpToRow == row) {
      return
    }
    
    // Find all the rows that are empty or indented past the current indent (i.e., that were indented as part of a past block that was removed)
    var rowsUpThroughIndent = this.sheet.getRange(row+1,1,removeUpToRow-row,col).getValues()
    for (var cellRow in rowsUpThroughIndent) {
      // Check if the row is not empty
      if (rowsUpThroughIndent[cellRow].join('').length) {
        removeUpToRow = Number(cellRow) + row + 1
        break
      }
    }

    // Remove everything that had been indented inside the old block of code
    var currentRow = removeUpToRow - 1
    while (currentRow > row) {
      this.sheet.deleteRow(currentRow)
      currentRow -= 1
    }
  }

  // Clears the cells from the old code block's code statement
  clearOldStatement(row,col) {
    // Add 10 at the end because getLastColumn doesn't included colored cells, so this is some extra slack in case there are cells farther out that are colored but don't have data in them
    var lastCol = Number(this.sheet.getLastColumn())+10;
    var oldStatementRange = this.sheet.getRange(row,col+1,1,lastCol-col)
    oldStatementRange.clear()
    oldStatementRange.clearDataValidations()
  }

  clearAllOldBlock(row,col) {
    this.clearOldStatement(row,col)
    this.clearOldLines(row,col)
  }

  // Goes down an indentation level and creates code block objects of all the lines at that level
  exportCodeColumn(startingRow, col, findLengthAlso = false) {
    const codeBlockObjects = []
    var lastRow = this.sheet.getLastRow()

    var pseudocodeCells = this.sheet.getRange(startingRow,col,lastRow-startingRow+1,this.sheet.getLastColumn()-col+1).getValues()
    for (var currentRow = 0; currentRow <= lastRow-startingRow; currentRow ++) {
      if (this.codeBlocks.includes(pseudocodeCells[currentRow][0])) {
        var newCodeBlockObject = this.exportCodeBlock(currentRow+startingRow,col)
        codeBlockObjects.push(newCodeBlockObject)
      }
      else if (pseudocodeCells[currentRow][0]) {
        break
      }
    }
    
    if (findLengthAlso) {
      return [codeBlockObjects, currentRow]
    }
    else{
      return codeBlockObjects
    }
  }

  // Takes all of the code blocks from the spreadsheet and creates a question object with them
  exportToQuestionObject() {
    var startingColumn = 1
    var codeBlocks = this.exportCodeColumn(this.startingRow, startingColumn)
    var variables = this.getVariables()
    var variableInQuestion = this.getVariableInQuestion()
    return new Question(codeBlocks, variables, variableInQuestion)
  }

  // Shows an example of what the filled in code outline will look like with the random values specified
  showPreview() {
    var examplePseudocode = this.exportToQuestionObject().fillInSpecificValues()
    this.getPreviewCell().setValue(examplePseudocode)
  }

  // Updates question onfo based on the cell that has just been changed
  updateQuestionInfo(row,col) {
    if (row == this.variablesRow) {
      this.initializeVariables()
    }

    var questionTitleCell = [1,2]
    if (row == questionTitleCell[0] && col == questionTitleCell[1]) {
      var questionName = this.sheet.getRange(row,col).getValue()
      this.sheet.setName(questionName)
      var quizBuilder = new QuizPlannerSheet(this.sheet.getParent().getSheetByName("Quiz Builder"))
      quizBuilder.updateQuestionNamesDropdown()
    }
  }

  // Instructions to run whenever the user edits the sheet
  runOnEdit(e) {
    var row = e.range.getRow()
    var col = e.range.getColumn()
    
    this.updateQuestionInfo(row,col)

    if (row >= this.startingRow && row < this.getPreviewRow()) {
      if (this.isCodeBlock(e)) {
        this.clearAllOldBlock(row,col)
        this.runCreateMethod(e.value, row, col)
      }
      this.showPreview()
      this.colorRow(row)
    }
  }

  // Checks if a cell is a valid place for a new code block
  newCodeBlockIsValid(cell) {
    var row = cell.getRow()
    var col = cell.getColumn()

    // Row too high up or too low in the sheet
    if (row < this.startingRow || row >= this.getPreviewRow()) {
      this.sheet.getParent().toast("Row is not in the pseudocode part of the sheet")
      return false
    }

    var rowRange = this.sheet.getRange(row,1,1,this.sheet.getLastColumn())

    // Other values in row
    if(!isEmpty(rowRange.getValues())) {
      this.sheet.getParent().toast("Cannot add new code block to a non-empty row")
      return false
    }

    // Other data validation in row
    if(!isEmpty(rowRange.getDataValidations())) {
      this.sheet.getParent().toast("Cannot add new code block to a row that already has a data validation")
      return false
    }

    // Not properly indented
    var [previousFirstCell, previousFirstCellColumn] = this.getFirstCellInRow(row-1)
    if (this.indentBlocks.includes(previousFirstCell)) {
      if (col != previousFirstCellColumn+1) {
        this.sheet.getParent().toast("Does not match up with previous block's indentation")
        return false
      }
    }
    // Need to add check for between IF and ELSE
    else if (previousFirstCell == "ELSE") {
      if (col != previousFirstCellColumn) {
        this.sheet.getParent().toast("Does not match up with previous block's indentation")
        return false
      }
    }
    else {
      if (col > previousFirstCellColumn) {
        this.sheet.getParent().toast("Cell is too far indented")
        return false
      }
    }

    return true
  }

  // Adds new row(s) with the data validations and colors cleared
  insertBlankRowsAfter(row,numRows) {
    this.sheet.insertRowsAfter(row,numRows)
    var newRows = this.sheet.getRange(row+1,1,numRows,this.sheet.getLastColumn()+10)
    newRows.clearDataValidations()
    newRows.setBackground('white')
  }

  // Adds a new dropdown menu at the end of the code outline for the user to select a new block of code
  addBlockAtEnd() {
    var previewRow = this.getPreviewRow()
    this.sheet.insertRowsBefore(previewRow-1,1)
    var newRow = this.sheet.getRange(previewRow-1,1,1,this.sheet.getLastColumn())
    newRow.clearDataValidations()
    this.createCodeBlockMenu(previewRow-1,1)
  }


  insertPseudocodeLine() {
    var ui = SpreadsheetApp.getUi();
    var row = ui.prompt("Enter the row you want to insert a new line *below*:").getResponseText();
    row = Number(row)
    
    if (row < this.startingRow || row >= this.getPreviewRow() - 1) {
      this.sheet.getParent().toast("Row not in pseudocode section")
      return
    }

    this.insertBlankRowsAfter(row,1)
    getRowRange(this.sheet,row+1).clearDataValidations()
  }

  // Returns the value and location (1-indexed) of the first cell in a row
  getFirstCellInRow (row) {
    var cells = getRowRange(this.sheet,row).getValues()[0]
    for (var col in cells) {
      if (cells[col]) {
        return [cells[col], Number(col)+1]
      }
    }
    return ["",-1]
  }

  // Inserts a dropdown menu for a new code block at whatever cell is selected
  insertCodeBlock(cell) {
    if (this.newCodeBlockIsValid(cell)) {
      this.createCodeBlockMenu(cell.getRow(),cell.getColumn())
    }
  }

  // Removes the last code block in the first column
  deleteLastBlock() {
    var firstColumn = this.sheet.getRange(this.startingRow,1,this.getPreviewRow()-this.startingRow,1).getValues().flat()
    var lastBlockRow = firstColumn.findLastIndex(e => e) + this.startingRow
    if (lastBlockRow > this.startingRow) {
      this.clearOldLines(lastBlockRow,1)
      this.sheet.deleteRow(lastBlockRow)
      this.showPreview()
    }
  }

  // Fills in a row with some color depending on the type of code block
  colorRow(row) {
    var [codeBlock, startingCol] = this.getFirstCellInRow(row)
    var colorDecayFactor = 0.5

    // Create the associated colors
    var codeBlockColors = {
      'assignmentStatement': [111, 168, 220],
      'changeByStatement': [118,165,175],
      'ifElseBlock': [246, 178, 107],
      'ifBlock': [241,194,50],
      'repeatXTimesBlock': [142,124,195],
      'repeatUntilBlock': [213, 166, 189],
      'forEachBlock': [234,153,153]
    }
    codeBlockColors['ELSE'] = lightenRGBColor(codeBlockColors['ifElseBlock'],colorDecayFactor)

    // Fill in the cells with color
    if (codeBlock in codeBlockColors) {
      var rowRange = this.sheet.getRange(row,1,1,this.sheet.getLastColumn()+1)
      var rowVals = rowRange.getValues()[0]
      var [r,g,b] = codeBlockColors[codeBlock]

      // Most upper case words will be keywords, but the ones in this list the user can still edit
      var upperCaseEditable = ['AND','OR','NOT','MOD']

      // Array to store the new colors of the row
      var newColors = Array(rowVals.length).fill('white')

      //Color the first cell
      newColors[startingCol-1] = rgbToHex([r,g,b])

      //Color remaining cells - keywords are lighter versions of the same color, editable cells are light grey
      for (let c = startingCol; c < newColors.length; c++) {
        var cellVal = String(rowVals[c]).trim()

        if (!cellVal) {
          // Add a grey cell at the end of the if statement blocks to indicate that more can be added to the boolean expression
          if (c>0 && rowVals[c-1] && this.booleanBlocks.includes(codeBlock)) {
            newColors[c] = '#d9d9d9'
          }
        }

        // Most uppercase cells and arrows are colored (indicate keywords in code)
        else if ((isUpperCase(cellVal) && !upperCaseEditable.includes(cellVal)) || cellVal == "←") {
          newColors[c] = rgbToHex(lightenRGBColor([r,g,b],colorDecayFactor))
        }

        else { // Non-keyword cells are grey
          newColors[c] = '#d9d9d9'
        }
        
      }
      rowRange.setBackgrounds([newColors])
    }
  }

  // Colors all rows in a certain range
  colorRows(firstRow, lastRow) {
    for (let row = firstRow; row <= lastRow; row++) {
      this.colorRow(row)
    }
  }

}

function createSheetQuestionObject(sheet) {
  return new SheetQuestion(sheet)
}
