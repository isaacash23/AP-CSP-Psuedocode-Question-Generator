class CodeLines extends BaseSyntax {
  constructor() {
    super()
  }

  // Methods that create lines of psuedocode

  displayStatement(displayValue) {
    this.indent()
    this.pseudocodeLines += `DISPLAY(${displayValue})`
    this.newLines()
  }

  createAssignmentStatement(variable, value) {
    this.indent()
    // Invisible unicode character is a flag for where to put "var" when converting to javascript
    let codeLine = `\u200B${variable} ← ${value}`
    this.pseudocodeLines += codeLine
    this.newLines()
  }

  createChangeByStatement(variable1,variable2,operator,changeAmount) {
    this.indent()
    this.pseudocodeLines += `\u200B${variable1} ← ${variable2} ${operator} ${changeAmount}`
    this.newLines()
  }

  ifStatement(booleanExpression) {
    this.indent()
    let codeLine = `IF (${booleanExpression})`
    this.pseudocodeLines += codeLine
    this.newLines()
    this.openBrackets()
    this.currentIndent += 1
  }

  elseStatement() {
    this.indent()
    this.pseudocodeLines += `ELSE`
    this.newLines()
    this.openBrackets()
    this.currentIndent += 1
  }

  repeatXTimesStatement(repeatTimes) {
    this.indent()
    this.pseudocodeLines += `REPEAT ${repeatTimes} TIMES`
    this.newLines()
    this.openBrackets()
    this.currentIndent += 1
  }

  repeatUntilStatement(booleanExpression) {
    this.indent()
    let codeLine = `REPEAT UNTIL (${booleanExpression})`
    this.pseudocodeLines += codeLine
    this.newLines()
    this.openBrackets()
    this.currentIndent += 1
  }

  forEachStatement(iteratorVariable,list) {
    this.indent()
    let codeLine = `FOR EACH ${iteratorVariable} IN ${list}`
    this.pseudocodeLines += codeLine
    this.newLines()
    this.openBrackets()
    this.currentIndent += 1
  }
}
