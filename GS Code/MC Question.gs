// This object stores information about a question to create the multiple choice item in a google form

class Question {
  
  constructor(codeBlocks,variables,variableInQuestion) {
    this.codeBlocks = codeBlocks
    this.variables = variables
    this.variableInQuestion = variableInQuestion
  }

  // Builds the pseudocode from the code block objects passed in from the spreadsheet
  getPseudocodeOutline() {
    let pseudocodeOutline = ""
    for (let codeBlock of this.codeBlocks) {
      pseudocodeOutline += codeBlock.pseudocodeLines
    }
    return pseudocodeOutline
  }

  // Fills in the random functions and lists that the user has inputted with specific values
  fillInSpecificValues() {
    let specificPseudocode = this.getPseudocodeOutline()

    const replacements = [
        [/\[(?<item>.*)\](?: ?)\*(?: ?)(?<amount>\d+)/g, (match,item,amount) => `[${Array(Number(amount)).fill(item.trim())}]`],
        [/RandomSelect\((?:\[)?(?<items>.*?)(?:\])?\)/g, (match,items) => choose(items.split(","))],
        [/RandomInt\((?<lo>-?\d+),(?<hi>-?\d+)\)/g, (match,lo,hi) => getRandomInteger(Number(lo),Number(hi))],
        [/RandomCompare\(\)/g, (match) => choose(["<",">","<=",">=","="])],
        [/RandomVar\(\)/g, (match) => choose(this.variables)],
        [/RandomOperator\(\)/g, (match) => choose(['AND','OR'])]
    ]
    
    for (var [pattern, replacementFunction] of replacements) {
        specificPseudocode = specificPseudocode.replaceAll(pattern,replacementFunction)
    }
    return specificPseudocode
  }

  // Converts AP Pseudocode to Javascript so the JS can be run and evaluated
  convertPseudoToJS(pseudocode) {
    var jsLines = pseudocode
    const replacements = [
        [" = ", " == "],
        [/REPEAT (?<numTimes>\d+) TIMES/g, "for (let repeaterDummy = 0; repeaterDummy < $<numTimes>; repeaterDummy++)"],
        [/REPEAT UNTIL( ?)\((?<booleanExp>.*?)\)/g, "while (!($<booleanExp>))"],
        [/FOR EACH (?<iterator>.*) IN (?<list>.*)/g, `for (var $<iterator> of $<list>)`],
        ["\u200B", "var "],
        ["←", "="],
        ["IF", "if"],
        ["ELSE", "else"],
        ["DISPLAY", "Logger.log"],
        ["AND", "&&"],
        ["OR", "||"],
        ["NOT", "!"],
        ["MOD", "%"]
    ]

    for (var [pattern, replacement] of replacements) {
        jsLines = jsLines.replaceAll(pattern,replacement)
    }

    return jsLines
  }

  // Runs the javascript and finds the value of a specified variable after running
  evaluatePseudocode(pseudocode, variable) {
    var newJS = this.convertPseudoToJS(pseudocode)
    newJS += `\n${variable}`
    Logger.log(newJS)
    return eval(newJS)
  }

  // Randomly make 4 multiple choice options that are close-ish to the answer
  createMCOptions(answer, numOptions = 4) {
    if (typeof answer != 'number') {
      Error("Error: createMCOptions method takes a number")
      return
    }

    // Create a range of possible numbers around the answer to draw from randomly for the other options
    if (Math.abs(answer) < 20) {
      var answerRangeLength = 10
    }
    else {
      var answerRangeLength = Math.abs(answer * 0.4)
    }
    //This ensures the actual correct answer is just as likely to be in any position (i.e., no preference for option C)
    var answerRangeStart = getRandomInteger(answer-answerRangeLength,answer);
    var answerRangeEnd = answerRangeStart + answerRangeLength

    // Fill in the array of answer options by picking random numbers out of the range
    var options = [answer]
    while (options.length < numOptions) {
      var randomChoice = getRandomInteger(answerRangeStart, answerRangeEnd)
      if (!options.includes(randomChoice)) {
        options.push(randomChoice)
      }
    }

    options.sort(function (a, b) {  return a - b;  });
    return options
  }

  // Creates a MC question asking about the value of a single variable
  createMCQuestion(form) {
    var variable = this.variableInQuestion
    if (variable == "RandomVariable()") {
      variable = choose(this.variables)
    }
    var questionPseudocode = this.fillInSpecificValues()

    var questionText = `What will the value of ${variable} be after running this code?\n\n`
    questionText += questionPseudocode
    

    var answer = this.evaluatePseudocode(questionPseudocode,variable)
    var newQuestion = form.addMultipleChoiceItem();
    newQuestion.setTitle(questionText)
    newQuestion.setPoints(1);
    var options = this.createMCOptions(answer);
    var choices = []
    for (let option of options) {
      choices.push(newQuestion.createChoice(option, option == answer));
    }
    newQuestion.setChoices(choices)
  }
}

function createQuestion(codeBlocks) {
  return new Question(codeBlocks)
}
