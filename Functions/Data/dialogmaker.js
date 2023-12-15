if (typeof data == 'undefined') { // VARIABLE DECLERATION
  let data;
  let dialog;
  let choices;
  let choicesMax;
  let tracker;
}

function dialogmaker() {
  outputField.style.textAlign = "center";
  const uses = ['speech', 'save', 'undo', 'choice', 'jump']
  
  
  if (x == 0) { // DECIDING NEW OR LOADING DIALOG
    if (input == "dialogmaker") {
      clear();
      newLine("Welcome to the Dialog Maker !!\n\nHere you can create your own dialog stories or dialog to be used in custom games using Cal. If the dialog is used in these games there are additional functions that you can use in the dialog to impact the game itself.\n\nFor example you can use the function __ to unlock and entrance or grant an item to the player based on your dialog decision.\n\nLets Begin!\n\nWould you like to create a new Dialog or Load one? simply enter the command New or Load.");
    } else if (input == "new") {
      x = 1
      data = []
      choicesMax = 0;
      choices = [];
      dialog = "";
      loadActiveDialog();
    } else if (input == "load") {
      clear();
      newLine("Please enter the Load data as a command below.");
      x = 1;
      y = "load";
    } else {
      clear();
      newLine(`Sorry '${input}' isn't a valid option, you can enter the command 'New' to start a new Dialog or you can enter the command 'Load' to load a Dialog from a file or it's data.`)
    }
  } else if (x == 1) { // EDITTING DIALOG
    if (y == 0) { // IF NO ACTIVE USE
      if (uses.includes(input)) {
        lowerCaseInput = false;
        y = input;
        clear();
        if (input == "speech") {
          newLine("Please enter the name of who is speaking this dialog.");
        } else if (input == "jump") {
          newLine("At which point in this Dialog would you like to Jump to?\n\nJust enter the Number of the section in the Dialog.");
        } else if (input == "choice") {
          newLine("Please enter how many choices you would like to provide.")
        } else if (input == "save") {
          let saveData = JSON.stringify(data);
          newLine("Here is the Save Data, this has also been copied to your clipboard.:\n\n" + saveData);
          navigator.clipboard.writeText(saveData);
        } else if (input == "undo") {
          data.pop();
          loadActiveDialog()
          y = 0;
        }
      } else {
        clear();
        newLine(`'${input}' is not a valid function.`);
        enterButton.disabled = true;
        setTimeout(() => {
          loadActiveDialog();
          enterButton.disabled = false;
        }, 2000);
      }
      
    } else { // IS USE ACTIVE
      if (y == "speech") {
        if (z == 0) {
          z = input;
          clear();
          newLine(`Please enter the Dialog of ${z}.`);
        } else {
          data.push(["speech", z, input])
          y = 0;
          z = 0;
          loadActiveDialog();
        }
      } else if (y == "jump") {
        if (!isNaN(parseInt(input))) {
          data.push(["jump", parseInt(input)]);
          y = 0;
          loadActiveDialog();
        } else {
          clear();
          newLine(`${input} is not a number.\n\nAt which point in this Dialog would you like to Jump to?\n\nJust enter the Number of the section in the Dialog.`);
        }
      } else if (y == "load") {
        data = JSON.parse(input);
        x = 1;
        y = 0;
        loadActiveDialog();
      } else if (y == "choice") {
        clear();
        if (z == 0) {
          choicesMax = parseInt(input);
          if (!isNaN(choicesMax)) {
            if (choices.length < choicesMax) {
              newLine(`Please Enter the Text for Choice ${choices.length + 1}`)
              z = 1;
            }
          } else {
            newLine(input + " is not a number.\n\nPlease enter how many choices you would like to provide.")
          }
        } else {
          if (choices.length == (z - 1)) {
            choices.push([input]);
            newLine("Please enter the number which this choice will place you in the dialog.")
          } else {
            if (!isNaN(parseInt(input))) {
              choices[(z - 1)].push(parseInt(input));
              z ++;
              if (z != choicesMax+1) {
                newLine(`Please Enter the Text for Choice ${choices.length + 1}`);
              } else {
                z = 0;
                y = 0;
                choicesMax = 0
                data.push(["choice", choices])
                choices = [];
                loadActiveDialog();
              }
            } else {
              newLine(`${input} is not a number.\n\nPlease enter the number which this choice will place you in the dialog.`)
            }
          }
        }
      }
    }
  }
}

function makeDecision () {
  
}

function loadActiveDialog () {
  clear();
  lowerCaseInput = true;
  newLine("Here are the available Functions:\n\n- Speech (Used to enter a new speech)\n- Jump (This will jump you to a point in this dialog, this is the number above each element)\n- Choice (Used to create a choice for the reader to choose, doing so takes them to a certain point in this dialog the same way as 'Jump'.)\n- Save (This will provide the Save data for Current dialog for you to save manually)\n- Undo (This will undo the most recent addition to your Dialog)");
  dialog = "";
  for (let i=0; i<data.length; i++) {
    if (data[i][0] == "speech") {
      dialog += `<b>${i}</b>\n<u>${data[i][1]}</u>\n${data[i][2]}\n\n`
    } else if (data[i][0] == "choice") {
      dialog += `<b>${i}</b>\n<u>Choice</u>\n`;
      for (let j=0; j<data[i][1].length; j++) {
        dialog += `${data[i][1][j][1]} - ${data[i][1][j][0]}\n`
      }
      dialog += "\n";
    } else if (data[i][0] == "jump") {
      dialog += `<b>${i}</b>\n<u>Jump</u>\nJump to Section ${data[i][1]}\n\n`;
    }
  }
  newLine(dialog);
  
}


dialogmaker();