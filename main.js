const outputField = document.querySelector('.console-output');
const inputField = document.querySelector('.console-input');
const enterButton = document.querySelector('.console-enter');

let input = "";
let lowerCaseInput = true;
let activeFunction = "";
let x = 0;
let y = 0;
let z = 0;

const functionList = [
  "clear",
  "book"
];

const responceList = {
  "help" : "You can use 'book' to load up the book which allows you to browse and edit several pages of text.\nYou can also use 'clear' to clear this screen to make space and keep it easy to read.",
  "hi" : "how are you?",
  "i'm good" : "that's good to hear."
};


enterButton.addEventListener('click', () => {
  if (inputField.value != "") {
    if (lowerCaseInput) {
      input = inputField.value.toLowerCase();
    } else {
      input = inputField.value;
    }
    inputField.value = "";
    if (activeFunction == "") {
      if (checkResponces()) {
        newLine(responceList[input]);
      } else if (checkFunctions()) {
        activeFunction = input;
        window[input]();
      } else {
        newLine('unknown command');
      }
      outputField.scrollTop = outputField.scrollHeight;
    } else {
      window[activeFunction]();
    }
  }
  inputField.focus();
});



function newLine(text) {
  let output = ""
  if (input != "" && activeFunction == "") {
    output ='<span>> ' + input + '</span>\n'
  }
  output += '> ' + text + "\n\n<hr>\n";
  outputField.innerHTML += output;
}

function checkFunctions() {
  if (functionList.includes(input)) {
    return true;
  } else {
    return false;
  }
}

function checkResponces() {
  if (responceList.hasOwnProperty(input)) {
    return true;
  } else {
    return false;
  }
}

function finishFunction () {
  activeFunction = "";
  outputField.style.textAlign = "left";
  x = 0;
  y = 0;
  z = 0;
}




// CAL FUNCTIONS

function clear() {
  input = "";
  outputField.innerHTML = "";
  newLine("Hi i'm Cal. Please type 'help' for more information.");
  finishFunction();
}



let bookOfPages = {"book" : "Welcome to the book, you can use 'new page' to create new pages.\n'edit page' will allow you to quickly edit the pages text.\n'delete page' will give you the option to delete the page your currently looking at.\nTo navigate this book and look at other pages you just have to type the name of the page and hit Enter.\nFor a list of every page in this book just type 'list'.\nTo close the book and return back to Cal just type 'exit'."};
let current_page = ""
function book() {
  outputField.innerHTML = "";
  if (bookOfPages.hasOwnProperty("list")) {
    delete bookOfPages["list"];
  }
  if (x == 0 && y == 0 && z == 0) {
    if (input == "new page") {
      x = "new page";
      newLine("Creating new page, please enter the title of the page");
    } else if (input == "edit page" && current_page != "book") {
      x = "edit page";
      newLine("Please enter the new Text for this page.")
      lowerCaseInput = false;
    } else if (input == "delete page" && current_page != "book") {
      x = "delete page";
      newLine(`Are you sure you want to delete page : ${current_page}?\n\n<hr>\n1 - Yes\n\n2 - No`);
    } else if (input == "list") {
      let listOutput = "Here is a list of every page:\n\n";
      let listOfKeys = Object.keys(bookOfPages);
      for (let i=0; i<listOfKeys.length; i++) {
        listOutput += "- " + listOfKeys[i] + "\n";
      }
      bookOfPages["list"] = listOutput;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>list</h1><hr>${bookOfPages["list"]}`;
    } else if (input == "exit") {
      clear();
    } else if (bookOfPages.hasOwnProperty(input)) {
      current_page = input;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>${input}</h1><hr>${bookOfPages[input]}`;
    } else {
      newLine(`Page : ${input} does not exist.`)
      enterButton.disabled = true;
      setTimeout(() => {
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>${current_page}</h1><hr>${bookOfPages[current_page]}`;
        enterButton.disabled = false;
      }, 2000);
    }
  
  } else {
    if (x == "new page") {
      if (y == 0) {
        y = input;
        newLine("Please enter the Pages text.")
        lowerCaseInput = false;
      } else {
        if (z == 0) {
          z = input;
          lowerCaseInput = true
          newLine(`Page Created.\nPage Title : ${y}\nPage Text : ${z}.\nIs this correct?\n\n<hr>\n1 - Yes\n\n2 - No`);
        } else {
          if (input == 1 || input == "yes") {
            bookOfPages[y] = z;
            outputField.style.textAlign = "center";
            outputField.innerHTML = `<h1>${y}</h1><hr>${bookOfPages[y]}`;
            current_page = y;
            x = 0;
            y = 0;
            z = 0;
          } else if (input == 2 || input == "no") {
            newLine("Page creation cancelled.")
            x = 0;
            y = 0;
            z = 0;
          }
        }
      }
    
    } else if (x == "edit page") {
      bookOfPages[current_page] = input;
      lowerCaseInput = true;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>${current_page}</h1><hr>${bookOfPages[current_page]}`;
      x = 0;
    } else if (x == "delete page") {
      if (input == 1 || input == "yes") {
        delete bookOfPages[current_page];
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>book</h1><hr>${bookOfPages["book"]}`;
        x = 0;
      }
    }
  }
}




// ON STARTUP

clear();