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
