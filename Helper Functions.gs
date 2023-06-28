// Get a random array element
function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Removes an element from an array
function removeElement(arr, element) {
  const index = arr.indexOf(element);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// Creates a dropdown menu in a certain cell
function createDropdownMenu(cell,list) {
  var dropDownMenu = SpreadsheetApp.newDataValidation().requireValueInList(list).build();
  cell.setDataValidation(dropDownMenu);
}

// Clears all the questions from a form
function clearForm(form){
  var items = form.getItems();
  while(items.length > 0){
    form.deleteItem(items.pop());
  }
}

// Checks if a 1d or 2d array contains all empty strings or all null values
function isEmpty(arr) {
  arr = arr.flat()
  if (arr.every(e => e === "") || arr.every(e => e === null)) {
    return true
  }
  return false
}

// Gets the entire row in a range object
function getRowRange(sheet,row) {
  return sheet.getRange(row,1,1,sheet.getLastColumn())
} 

// Checks for uppercase (space is allowed)
function isUpperCase(str) {
    return /^[A-Z ]+$/.test(str);
}

// Converts 3 rgb integers to hexadecimal
function rgbToHex(rgbArray) {
  var [r,g,b] = rgbArray
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

// Lightens a color by a factor between 0 and 1 (1 is lightest, 0 is closest to original)
function lightenRGBColor(rgbColors,lightenFactor) {
  if (rgbColors.some(x => x>255 || x<0)) {
    Error("RGB values must be between 0 and 255")
    return
  }
  var [newR,newG,newB] = rgbColors.map(x => (x + (255-x)*lightenFactor))
  return [newR,newG,newB]
}
