if (typeof data == 'undefined') { // VARIABLE DECLERATION
  let data;
  let dialog;
}

function dialogmaker() {
  outputField.style.textAlign = "center";
  const uses = ['dialog', 'save', 'undo']
  
  if (x == 0) { // DECIDING NEW OR LOADING DIALOG
    if (input == "dialogmaker") {
      clear();
      newLine("Welcome to the Dialog Maker !!\n\nHere you can create your own dialog stories or dialog to be used in custom games using Cal. If the dialog is used in these games there are additional functions that you can use in the dialog to impact the game itself.\n\nFor example you can use the function __ to unlock and entrance or grant an item to the player based on your dialog decision.\n\nLets Begin!\n\nWould you like to create a new Dialog or Load one? simply enter the command New or Load.");
    } else if (input == "new") {
      x = 1
      data = []
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
        if (input == "dialog") {
          newLine("Please enter the name of who is speaking this dialog.");
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
      if (y == "dialog") {
        if (z == 0) {
          z = input;
          clear();
          newLine(`Please enter the Dialog of ${z}.`);
        } else {
          data.push(["dialog", z, input])
          y = 0;
          z = 0;
          loadActiveDialog();
        }
      } else if (y == "load") {
        data = JSON.parse(input);
        x = 1;
        y = 0;
        loadActiveDialog();
      }
    }
  }
}

function loadActiveDialog () {
  clear();
  lowerCaseInput = true;
  newLine("Here are the available Functions:\n\n- Dialog (Used to enter a new speech)\n- Save (This will provide the Save data for Current dialog for you to save manually)\n- Undo (This will undo the most recent addition to your Dialog)");
  dialog = "";
  for (let i=0; i<data.length; i++) {
    if (data[i][0] == "dialog") {
      dialog += `<u>${data[i][1]}</u>\n${data[i][2]}\n\n`
    }
  }
  newLine(dialog);
  
}


dialogmaker();