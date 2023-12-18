if (typeof data == 'undefined') { // VARIABLE DECLERATION
  let data;
  let dialog;
  let choices;
  let choicesMax;
  let tracker;
}

function dialogmaker() {
  outputField.style.textAlign = "center";
  const uses = ['speech', 'save', 'undo', 'choice', 'jump', 'add', 'reduce', 'count', 'destroy', 'end']
  
  
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
      lowerCaseInput = false;
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
        } else if (input == "end") {
          data.push(["end"]);
          loadActiveDialog();
          y = 0;
        } else if (input == "destroy") {
          data.push(["destroy"]);
          loadActiveDialog();
          y = 0;
        } else if (input == "count") {
          newLine("Please enter either the Name of an Object in a Player's Inventory or of a Global Variable. This is what you will be checking.");
          y = "count";
        } else if (input == "choice") {
          newLine("Please enter how many choices you would like to provide.")
        } else if (input == "save") {
          y = "saving";
          newLine("What would you like to call the Save file?");
        } else if (input == "add") {
          y = "add";
          newLine("Please enter either the Name of an Object to add to the Player's Inventory, otherwise the Name of a  Global Variable to increase, If the Global Variable does not exist then one will be Created with this value.");
        } else if (input == 'reduce') {
          y = 'reduce';
          newLine("Please enter either the Name of an Object to take away from a Player's Inventory, otherwise if you enter the Name of a Global Variable, its value will be reduced.\n\nA value cannot be reduced below 0 this way.")
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
      } else if (y == "count") {
        clear();
        if (z == 0) {
          newLine(`Please enter the amount of ${input} that you want to Check, If there is equal or more than this amount, then this will return True, otherwise it will return False.`)
          data.push(["count", input])
          z = 1;
        } else if (z == 1) {
          if (!isNaN(parseInt(input))) {
            newLine(`Please enter the ID of the Dialog that you want to Jump to if this returns True`)
            data[data.length - 1].push(parseInt(input));
            z = 2;
          }
        } else if (z == 2) {
          if (!isNaN(parseInt(input))) {
            newLine(`Please enter the ID of the Dialog that you want to Jump to if this returns False`)
            data[data.length - 1].push(parseInt(input));
            z = 3;
          } 
        } else if (z == 3) {
          if (!isNaN(parseInt(input))) {
            data[data.length - 1].push(parseInt(input));
            z = 0;
            y = 0;
            loadActiveDialog();
          }
        }
      } else if (y == "add") {
        clear();
        if (z == 0) {
          newLine(`Please enter the amount of ${input} that you want to either Add to the Player's Inventory or the Global Variable.`);
          z = input;
        } else {
          if (!isNaN(parseInt(input))) {
            data.push(["add", z, parseInt(input)]);
            z = 0;
            y = 0;
            loadActiveDialog();
          }
        }
      } else if (y == "reduce") {
        clear();
        if (z == 0) {
          newLine(`Please enter the amount of ${input}  that you want to either remove from a Player's Inventory or reduce a Global Variable.`);
          z = input;
        } else {
          if (!isNaN(parseInt(input))) {
            data.push(["reduce", z, parseInt(input)]);
            z = 0;
            y = 0;
            loadActiveDialog();
          }
        }
      } else if (y == "saving") {
        clear();
        let saveData = JSON.stringify(data);
        let toSave = `var ${input} = ${saveData}`
        newLine("Here is the Save Data, this has also been copied to your clipboard.:\n\n" + toSave);
        navigator.clipboard.writeText(toSave);
      } else if (y == "load") {
        data = JSON.parse(input);
        x = 1;
        y = 0;
        loadActiveDialog();
        lowerCaseInput = true;
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
  newLine("Here are the available Functions:\n\n- Speech (Used to enter a new speech)\n- Jump (This will jump you to a point in this dialog, this is the number above each element)\n- Choice (Used to create a choice for the reader to choose, doing so takes them to a certain point in this dialog the same way as 'Jump'.)\n- Save (This will provide the Save data for Current dialog for you to save manually)\n- Add (Either adds an Object to the player's Inventory, or adds to a Global Variable within the Dialog)\n- Reduce (Either reduces the amount of an Object in a player's Inventory, or reduces a Global Variable within the Dialog. Cannot reduce below 0)\n- Count (If the stated Object in a Player's Inventory or Global Variable is equal or Greater than the given Value, then Jump the Dialog to the ID given if true, otherwise Jump the Dialog to the ID if false)\n- Undo (This will undo the most recent addition to your Dialog)\n- Destroy (Removes the Object from the Map)\n- End (When a Dialog gets to this ID the dialog ends, the Dialog cannot end without it)");
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
    } else if (data[i][0] == "add") {
      dialog += `<b>${i}</b>\n<u>Add</u>\nAdding ${data[i][2]} to ${data[i][1]}\n\n`;
    } else if (data[i][0] == "reduce") {
      dialog += `<b>${i}</b>\n<u>Reduce</u>\nReducing ${data[i][2]} from ${data[i][1]}\n\n`;
    } else if (data[i][0] == "destroy") {
      dialog += `<b>${i}</b>\n<u>Destory</u>\n\n`
    } else if (data[i][0] == "count") {
      dialog += `<b>${i}</b>\n<u>Count</u>\nChecking if there is at least ${data[i][2]} of ${data[i][1]}\nIf True : ${data[i][3]}\nIf False : ${data[i][4]}\n\n`
    } else if (data[i][0] == "end") {
      dialog += `<b>${i}</b>\n<u>End</u>\n\n`
    }
  }
  newLine(dialog);
  
}


dialogmaker();