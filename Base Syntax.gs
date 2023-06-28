class BaseSyntax {
  constructor() {
    this.pseudocodeLines = ""
    this.currentIndent = 0
  }

  // Methods for adding syntax to the pseudocode

  indent() {
    var indentSize = 5
    let space = " ".repeat(this.currentIndent*indentSize)
    this.pseudocodeLines += space
  }

  newLines() {
    this.pseudocodeLines += '\n'
  }
  
  openBrackets() {
    this.indent()
    this.pseudocodeLines += '{\n'
  }

  closeBrackets() {
    this.unindent()
    this.indent()
    this.pseudocodeLines += '}'
    this.newLines()
  }

  unindent() {
    if (this.currentIndent > 0) {
      this.currentIndent -= 1
    }
  }
}
