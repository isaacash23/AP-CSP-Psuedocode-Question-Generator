// Classes that represent each type of code block, and create 

class assignmentStatement extends CodeLines {
  constructor({variable, value, currentIndent}){
    super()
    this.variable = variable
    this.value = value
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.createAssignmentStatement(this.variable,this.value)
  }
}

class changeByStatement extends CodeLines {
  constructor({setVariable,changeVariable,operator,changeValue,currentIndent}) {
    super()
    this.setVariable = setVariable
    this.changeVariable = changeVariable
    this.operator = operator
    this.changeValue = changeValue
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.createChangeByStatement(this.setVariable,this.changeVariable,this.operator,this.changeValue)
  }
}

class ifBlock extends CodeLines {
  constructor({booleanExpression, innerCodeBlocks, currentIndent}){
    super()
    this.booleanExpression = booleanExpression
    this.innerCodeBlocks = innerCodeBlocks
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.ifStatement(this.booleanExpression)
    for (var codeBlock of this.innerCodeBlocks) {
      this.pseudocodeLines += codeBlock.pseudocodeLines
    }
    this.closeBrackets()
  }
}

class ifElseBlock extends CodeLines {
  constructor({booleanExpression,trueCodeBlocks,falseCodeBlocks,currentIndent}) {
    super()
    this.booleanExpression = booleanExpression
    this.trueCodeBlocks = trueCodeBlocks
    this.falseCodeBlocks = falseCodeBlocks
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.ifStatement(this.booleanExpression)
    for (var trueBlock of this.trueCodeBlocks) {
      this.pseudocodeLines += trueBlock.pseudocodeLines
    }
    this.closeBrackets()
    this.elseStatement()
    for (var falseBlock of this.falseCodeBlocks) {
      this.pseudocodeLines += falseBlock.pseudocodeLines
    }
    this.closeBrackets()
  }
}

class repeatXTimesBlock extends CodeLines {
  constructor ({repeatTimes, innerCodeBlocks, currentIndent}) {
    super()
    this.repeatTimes = repeatTimes
    this.innerCodeBlocks = innerCodeBlocks
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.repeatXTimesStatement(this.repeatTimes)
    for (var codeBlock of this.innerCodeBlocks) {
      this.pseudocodeLines += codeBlock.pseudocodeLines
    }
    this.closeBrackets()
  }
}

class repeatUntilBlock extends CodeLines {
  constructor({booleanExpression, innerCodeBlocks, currentIndent}){
    super()
    this.booleanExpression = booleanExpression
    this.innerCodeBlocks = innerCodeBlocks
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.repeatUntilStatement(this.booleanExpression)
    for (var codeBlock of this.innerCodeBlocks) {
      this.pseudocodeLines += codeBlock.pseudocodeLines
    }
    this.closeBrackets()
  }
}

class forEachBlock extends CodeLines {
  constructor({iteratorVariable, list, innerCodeBlocks, currentIndent}) {
    super()
    this.iteratorVariable = iteratorVariable
    this.list = list
    this.innerCodeBlocks = innerCodeBlocks
    this.currentIndent = currentIndent
    this.createPseudocode()
  }

  createPseudocode() {
    this.forEachStatement(this.iteratorVariable,this.list)
    for (var codeBlock of this.innerCodeBlocks) {
      this.pseudocodeLines += codeBlock.pseudocodeLines
    }
    this.closeBrackets()
  }
}


function createCodeBlockObject(name,args) {
  var codeBlockObjects = {
    "assignmentStatement": assignmentStatement,
    "changeByStatement": changeByStatement,
    "ifBlock": ifBlock,
    "ifElseBlock": ifElseBlock,
    "repeatXTimesBlock": repeatXTimesBlock,
    "repeatUntilBlock": repeatUntilBlock,
    "forEachBlock": forEachBlock
  }

  return new codeBlockObjects[name](args)
}
