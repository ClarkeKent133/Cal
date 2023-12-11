const outputField = document.querySelector('.console-output');
const canvasField = document.querySelector('.canvas-area');
const inputField = document.querySelector('.console-input');
const enterButton = document.querySelector('.console-enter');
const topArea = document.querySelector('.top');

let input = "";
let lowerCaseInput = true;
let activeFunction = "";
let x = 0;
let y = 0;
let z = 0;
let canvasAnimating = false;
let canvasWidth;
let canvasHeight;
let canvas;
let c;

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
  "game"
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
    if (input == "exit") {
      finishFunction();
    } else if (input == "clear") {
      clear();
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
  outputField.style.height = `calc(100% - 20px)`;
  topArea.style.flexDirection = 'column'
  canvasField.style.display = 'none';
  clear();
  newLine("Hi i'm Cal. Please type 'help' for more information.");
}



// CAL FUNCTIONS


// CLEAR

function clear() {
  input = "";
  outputField.innerHTML = "";
}

function openCanvas() {
  inputField.blur();
  canvasWidth = Math.round(outputField.getBoundingClientRect().width - 20);
  canvasHeight = Math.round(outputField.getBoundingClientRect().height - 20);
    
  if (canvasHeight > canvasWidth) {
    canvasHeight = canvasWidth;
    outputField.style.height = `calc(100% - ${canvasHeight}px - 50px)`;
  } else {
    canvasWidth = canvasHeight;
    topArea.style.flexDirection = 'row';
    canvasField.style.marginRight = '10px';
  }
  canvasField.style.height = `${canvasHeight}px`;
  canvasField.style.width = `${canvasWidth}px`;
  canvasField.innerHTML = `<canvas id='canvas' width='${canvasWidth}px' height='${canvasHeight}px style="image-rendering: pixelated;"'></canvas>`;
  canvasField.style.display = 'block';
  animationStarted = false;
  /** @type {HTMLCanvasElement} */
  canvas = document.querySelector("#canvas");
  c = canvas.getContext('2d');
  c.imageSmoothingEnabled = false;
}



// ON STARTUP

finishFunction();