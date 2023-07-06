// These methods help create each code block in a spreadsheet, and export those blocks into a format that can be used to create a quiz question

class SheetCodeBlocks {
  constructor(sheet) {
    this.sheet = sheet
    this.variablesRow = 4
    this.startingRow = 12
    this.variables = this.getVariables()
    this.codeBlocks = ["assignmentStatement", "changeByStatement", "ifBlock", "ifElseBlock", "repeatXTimesBlock","repeatUntilBlock","forEachBlock"]
    this.indentBlocks = ["ifBlock", "ifElseBlock", "repeatXTimesBlock", "repeatUntilBlock","forEachBlock"]
    this.booleanBlocks = ["ifBlock", "ifElseBlock", "repeatUntilBlock"]
  }

  // Gets the variable names that are part of the question
  getVariables() {
    var variablesRange = this.sheet.getRange(this.variablesRow, 1, 1, this.sheet.getLastColumn());
    this.variables = variablesRange.getValues()[0].filter(n => n);
    return this.variables
  }

  // Creates a dropdown menu of the differen code blocks the user can choose from
  createCodeBlockMenu(row,col) {
    var newCell = this.sheet.getRange(row,col)
    newCell.setFontFamily("Courier New")
    createDropdownMenu(newCell,this.codeBlocks)
  }

  // Creates a boolean statement (e.g., x<5) in the code outline. Option to add an operator (i.e., AND or OR)
  createBooleanStatement(row,col,addOperator=false) {
    var statementLength = 7
    var cells = this.sheet.getRange(row,col,1,statementLength)
    if (addOperator) {
      var cellValues = [["RandomVar()","RandomCompare()","RandomInt(1,10)","RandomOperator()","RandomVar()","RandomCompare()","RandomInt(1,10)"]]
    }
    else {
      var cellValues = [["RandomVar()","RandomCompare()","RandomInt(1,10)",,,,,]]
    }
    cells.setFontFamily("Courier New").setValues(cellValues)
  }

  // These methods create the different types of code blocks in the outlines

  createAssignmentStatement(row,menuCol,variable=choose(this.variables)) {
    var cells = this.sheet.getRange(row,menuCol+1,1,3);
    cells.setFontFamily("Courier New")
    cells.setValues([[variable,"←","RandomInt(1,10)"]])
  }

  createChangeByStatement(row,menuCol,variable=choose(this.variables)) {
    var cells = this.sheet.getRange(row,menuCol+1,1,5);
    cells.setFontFamily("Courier New")
    cells.setValues([[variable,"←",variable,"+","RandomInt(1,10)"]])
  }

  createIfBlock(row,col) {
    this.sheet.getRange(row,col+1).setFontFamily("Courier New").setValue("IF");
    this.createBooleanStatement(row,col+2)
    this.insertBlankRowsAfter(row,1)
    this.createCodeBlockMenu(row+1,col+1)
  }

  createIfElseBlock(row,col) {
    this.createIfBlock(row,col)
    this.insertBlankRowsAfter(row+1,2)
    this.sheet.getRange(row+2,col+1).setFontFamily("Courier New").setValue("ELSE")
    this.createCodeBlockMenu(row+3,col+1)
    this.colorRow(row+2)
  }

  createRepeatXTimesBlock(row,col) {
    var repeatStatementCells = this.sheet.getRange(row,col+1,1,3);
    repeatStatementCells.setFontFamily("Courier New").setValues([["REPEAT","RandomInt(2,5)","TIMES"]]);
    this.insertBlankRowsAfter(row,1);
    this.createCodeBlockMenu(row+1,col+1);
  }

  createRepeatUntilBlock(row,col) {
    this.sheet.getRange(row,col+1).setFontFamily("Courier New").setValue("REPEAT UNTIL");
    this.createBooleanStatement(row,col+2,false)
    this.insertBlankRowsAfter(row,1);
    this.createCodeBlockMenu(row+1,col+1);
  }

  createForEachBlock(row,col) {
    var loopStatementCells = this.sheet.getRange(row,col+1,1,4);
    loopStatementCells.setFontFamily("Courier New").setValues([["FOR EACH","item","IN","list"]]);
    this.insertBlankRowsAfter(row,1);
    this.createCodeBlockMenu(row+1,col+1);
  }

  // End of create methods

  // Runs one of the methods to create a block of pseudocode outline in the spreadsheet, based one what the user has selected from the dropdown menu
  runCreateMethod(codeBlockEntry,row,col) {
    const codeBlockCreateMethods = {
      "assignmentStatement": this.createAssignmentStatement,
      "changeByStatement": this.createChangeByStatement,
      "ifBlock": this.createIfBlock,
      "ifElseBlock": this.createIfElseBlock,
      "repeatXTimesBlock": this.createRepeatXTimesBlock,
      "repeatUntilBlock": this.createRepeatUntilBlock,
      "forEachBlock": this.createForEachBlock
    }
    if (codeBlockEntry in codeBlockCreateMethods) {
      codeBlockCreateMethods[codeBlockEntry].bind(this)(row,col)
    }
    else {
      Error("The code block you entered was not found")
    }
  }

  // Functions that export the relevant information for each type of code block into an object that can be used elsewhere

  exportAssignmentStatement(row,col) {
    var rowData = this.sheet.getRange(row,col,1,4).getValues()[0]
    var variable = rowData[1]
    var value = rowData[3]
    
    var assignmentStatementObject = createCodeBlockObject('assignmentStatement',{variable: variable, value: value, currentIndent: col-1})
    return assignmentStatementObject
  }

  exportChangeByStatement(row,col) {
    var rowData = this.sheet.getRange(row,col,1,6).getValues()[0]
    var setVariable = rowData[1]
    var changeVariable = rowData[3]
    var operator = rowData[4]
    var changeValue = rowData[5]
    
    var changeByStatementObject = createCodeBlockObject('changeByStatement',{setVariable: setVariable, changeVariable: changeVariable, operator: operator, changeValue: changeValue, currentIndent: col-1})
    return changeByStatementObject
  }

  exportIfBlock(row,col) {
    var booleanCells = this.sheet.getRange(row,col,1,this.sheet.getLastColumn()-col+2).getValues()[0]
    var booleanExpression = booleanCells.slice(2,-1).join(' ').trim()
    var innerCodeBlocks = this.exportCodeColumn(row+1,col+1)
    
    var args = {booleanExpression: booleanExpression, innerCodeBlocks: innerCodeBlocks, currentIndent: col-1}

    var ifBlockObject = createCodeBlockObject('ifBlock',args)
    return ifBlockObject
  }

  exportIfElseBlock(row,col) {
    var lastRow = this.sheet.getLastRow()
    var booleanCells = this.sheet.getRange(row,col,1,this.sheet.getLastColumn()-col+2).getValues()[0]
    var booleanExpression = booleanCells.slice(2,-1).join(' ').trim()
    var [trueCodeBlocks, totalTrueRows] = this.exportCodeColumn(row+1,col+1,true)
  
    var elseRow = row+totalTrueRows+1
    var falseCodeBlocks = this.exportCodeColumn(elseRow+1,col+1)

    var args = {booleanExpression: booleanExpression, trueCodeBlocks: trueCodeBlocks, falseCodeBlocks: falseCodeBlocks, currentIndent: col-1}

    var ifElseBlockObject = createCodeBlockObject('ifElseBlock',args)
    return ifElseBlockObject
  }

  exportRepeatXTimesBlock(row,col) {
    var repeatTimes = this.sheet.getRange(row,col+2).getValue()
    var innerCodeBlocks = this.exportCodeColumn(row+1,col+1)

    var args = {repeatTimes: repeatTimes, innerCodeBlocks: innerCodeBlocks, currentIndent: col-1}

    var repeatXTimesBlockObject = createCodeBlockObject('repeatXTimesBlock',args)
    return repeatXTimesBlockObject
  }

  exportRepeatUntilBlock(row,col) {
    var booleanCells = this.sheet.getRange(row,col,1,this.sheet.getLastColumn()-col+2).getValues()[0]
    var booleanExpression = booleanCells.slice(2,-1).join(' ').trim()
    var innerCodeBlocks = this.exportCodeColumn(row+1,col+1)

    var args = {booleanExpression: booleanExpression, innerCodeBlocks: innerCodeBlocks, currentIndent: col-1}

    var ifBlockObject = createCodeBlockObject('repeatUntilBlock',args)
    return ifBlockObject
  }

  exportForEachBlock(row,col) {
    var iteratorVariable = this.sheet.getRange(row,col+2).getValue()
    var list = this.sheet.getRange(row,col+4).getValue()
    var innerCodeBlocks = this.exportCodeColumn(row+1,col+1)

    var args = {iteratorVariable: iteratorVariable, list: list, innerCodeBlocks: innerCodeBlocks, currentIndent: col-1}

    var forEachBlockObject = createCodeBlockObject('forEachBlock',args)
    return forEachBlockObject
  }

  // End of export functions

  // Finds the appropiate export method for the type of code block
  getExportMethod(codeBlockEntry) {
    var codeBlockExportMethods = {
      "assignmentStatement": this.exportAssignmentStatement,
      "changeByStatement": this.exportChangeByStatement,
      "ifBlock": this.exportIfBlock,
      "ifElseBlock": this.exportIfElseBlock,
      "repeatXTimesBlock": this.exportRepeatXTimesBlock,
      "repeatUntilBlock": this.exportRepeatUntilBlock,
      "forEachBlock": this.exportForEachBlock
    }
    if (codeBlockEntry in codeBlockExportMethods) {
      return codeBlockExportMethods[codeBlockEntry].bind(this)
    }
    else {
      Error('Code block not found')
    }
  }

  // Create an object representing a specific block of code from the spreadsheet
  exportCodeBlock(row,col) {
    var codeBlock = this.sheet.getRange(row,col).getValue()
    var codeBlockObject = this.getExportMethod(codeBlock)(row,col)
    return codeBlockObject
  }

}
