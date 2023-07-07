# AP-CSP-Psuedocode-Question-Generator
This repository contains Google Apps Script code for a google spreadsheet that can create automatically-generated AP Computer Science Principles pseudocode questions. The user defines the outline of the code, and then the Apps Script fills in random values and turns it into a multiple choice question. Also contains documentation and tutorials.

**How-To Steps:**

1. Make a copy of the spreadsheet by clicking [here](https://docs.google.com/spreadsheets/d/1fVZzHGPySJPLb7-WP7YKkvMtsXDKwRmUsMpL8TidAco/copy#gid=597973330). Be sure that the associated scripts are copied as well, and give permission to the scripts as needed.
2. Click on the “New Question Type” button. You may have to authorize the program and then re-click on it. After running, it should create a new sheet.
3. Once a new sheet is created, fill in the information at the top by typing in:
  a. A name for this type of question
  b. Names for the variables in the question, and
  c. Which variable for the final question to ask about (you can write RandomVar() to have it pick a random variable)
4. Create a template for the pseudocode underneath the row that says “Pseudocode Outline”. 
  a. Start by clicking “Insert Block at End”. This will create a new dropdown menu.
  b. From the dropdown menu, select what type of code block you would like to add. Indented blocks will automatically create new dropdown menus to select another code block from.
  c. Edit any part of the outline in the gray cells you would like to change. 
  d. View a preview of the question at the bottom with the random values filled in, and change the outline accordingly to get the type of question you want
5. Once you have created the outlines for the different types of question you want in your quiz, go to the “Quiz Builder” sheet to create a Google quiz form
  a. In the first and second columns, choose the type of question you want in your quiz, and how many of that type you want (you can include as many question types as you want)
  b. Pick a name for the quiz in the gray cell
  c. Click the “Create Quiz!” button. After a few seconds, a link to the Google quiz should appear in the sheet.

**User Functions:**

RandomInt(lo,hi) -> returns a random integer from lo (inclusive) to hi (exclusive)

RandomVar() -> returns a random variable from the row of variables the user inputs at the top of the sheet

RandomCompare() -> returns a random rational operator (i.e. <, <=, >, >=, or =)

RandomOperator() -> returns a random boolean operator (i.e AND or OR)

RandomSelect(items) - > picks a random item from the arguments. Can input a list of items or multiple arguments. (Note: do not use quotation marks around the arguments)
Example: RandomSelect(a,b,c) and RandomSelect([a,b,c]) will both randomly pick a, b, or c
Example: RandomSelect(>,>=) will pick either the > or >= symbol 
Example: Random(,NOT) will pick either NOT or won’t return anything

[item] * n -> creates a list of n elements, all filed with item
Example: [RandomInt(1,10)] * 5 will create a list of 5 random numbers
Example: [4] * 3 will return [4,4,4,4]


**Supported AP CSP Pseudocode**

Variable assignment: var ← expression

Math operators: +, -, *, /, MOD

Rational operators: <, <=, >, >=, =

Boolean operators: AND, OR, NOT

Selection: IF, IF ELSE

Iteration: REPEAT x TIMES, REPEAT UNTIL

Lists: FOR EACH


**User Buttons:**

New Question Type: Creates a new sheet to build a question outline in

Create Quiz: Creates a Google Form with randomly generated questions based on the types of questions chosen

Insert Block at End: Inserts a new dropdown menu for a code block at the end of the current code outline

Insert New Line: Inserts a new row in the spreadsheet after the specified line

Insert Code Block: Inserts a code block dropdown menu at the cell the user is currently highlighting

Delete Last Block: Deletes the last code block in the first column
