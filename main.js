const outputField = document.querySelector('.console-output');
const inputField = document.querySelector('.console-input');
const enterButton = document.querySelector('.console-enter');

let input = "";
let lowerCaseInput = true;
let activeFunction = "";
let x = 0;
let y = 0;
let z = 0;
let canvasAnimating = false;

keys = {
  'a' : false,
  's' : false,
  'd' : false,
  'w' : false,
  ' ' : false
};

const functionList = [
  "clear",
  "book",
  "canvas"
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
    if (input == "clear" || input == "exit") {
      clear()
    } else if (input == "check") {
      console.log(document.querySelector('body'))
    } else if (activeFunction == "") {
      if (checkResponces()) {
        newLine(responceList[input]);
      } else if (checkFunctions()) {
        activeFunction = input;
        addDataHTML("main", `${input}`);
      } else {
        newLine('unknown command');
      }
      outputField.scrollTop = outputField.scrollHeight;
    } else {
      
      window[activeFunction]();
    }
  }
  if (input != 'canvas') {
    inputField.focus();
  }
});

function addFunctionHTML(parentID, sourceID) {
  let script = document.createElement('script');
  script.src = `./Functions/${sourceID}.js`;
  script.id = sourceID;
  document.querySelector(`#${parentID}`).appendChild(script);
}

function addDataHTML(parentID, sourceID) {
  let script = document.createElement('script');
  script.src = `./Functions/Data/${sourceID}.js`;
  script.id = sourceID;
  document.querySelector(`#${parentID}`).appendChild(script);
}



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
  document.querySelector('#main').innerHTML = '';
  outputField.style.textAlign = "left";
  x = 0;
  y = 0;
  z = 0;
  canvasAnimating = false;
  
}



// CAL FUNCTIONS


// CLEAR

function clear() {
  input = "";
  outputField.innerHTML = "";
  newLine("Hi i'm Cal. Please type 'help' for more information.");
  finishFunction();
}

// ON STARTUP

clear();