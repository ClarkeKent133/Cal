// WHEN I WANT TO INCLUDE A NEW MAP, ENSURE THE .JS FILE IS IN MAPDATA FOLDER AND THEN ADD DESCRIPTION IN GAMEMAKER().


if (typeof data == 'undefined') { // VARIABLE DECLERATION
  let data;
  let mapsUsed;
  let mapDescriptions;
  let objectUses;
  let waitForPlayerInput;
  let equipped;
  let dialogsData;
  let currentDialog;
  let dialogTracker;
  let dialogHistory;
  let travellingMap;
  let mapPlacements;
  let currentMap;
  let usingObject;
  let interacting;
  let currentMapPlacement;
  let objectVariables;
  let allMaps;
  let currentTurn;
  let playing;
  let gameKeys;
  let globalVariables;
  let inventory;
  let facingDirection;
}



async function gamemaker () {
  if (x == 0) {
    if (input == "gamemaker") {
      playing = false;
      gameKeys = {
        "a": false,
        "s": false,
        "d": false,
        "w": false,
        "e": false
      }
      mapPlacements = {};
      usingObject = "";
      interacting = false;
      objectVariables = {};
      equipped = " ";
      mapsUsed = [];
      allMaps = {};
      currentDialog = "";
      globalVariables = {"hp" : 15 , "maxhp" : 20 , "mana" : 5 , "maxmana" : 8};
      dialogHistory = [];
      travellingMap = "world";
      inventory = {};
      dialogTracker = 0;
      data = {};
      dialogsData = {};
      facingDirection = [0 , 0];
      waitForPlayerInput = () => {};
      mapDescriptions = {
        "map0" : "A baren field with a house and a single Player.",
        "map1" : "The left side of the field",
        "map2" : "The top side of a field with some flowers",
        "map3" : "The Right side of a field with a house.",
        "map4" : "The Bottom of the Map",
        "map5" : "A narrow Stretch",
        "map6" : "An island."
      }
      objectUses = {
        "flower" : {"hp" : 10, "range" : 2, "radius" : 1},
        "house" : {"hp" : 5, "range" : 0},
        "PC_first" : {"hp" : 5, "range" : 0}
      };
      //openCanvas();
      clear();
      newLine("Welcome to the Game Maker !!\n\nWould you like to create a new game or one from save data? To choose please enter the commands New or Load.");
    } else if (input == "new") {
      clear();
      gameHomepage();
    } else if (input == "load") {
      clear();
      newLine("Please enter the Load Data and hit Enter.");
      x = "loading";
      lowerCaseInput = false;
    }
  } else if (x == "homepage") {
    if (y == 0) {
      if (input == "add") {
        clear();
        showListOfMaps();
      } else if (input == "remove") {
        clear();
        newLine("Please enter the Name of the Map that you want to remove from your Game.");
        y = "remove";
      } else if (input == "play") {
        if (Object.keys(data).length > 0) {
          clear();
          playing = false;
          play();
          x = "playing";
        }
      }
    } else if (y == "remove") {
      clear();
      if (input == "back") {
        gameHomepage();
      } else if (mapsUsed.includes(input)) {
        mapsUsed.splice(mapsUsed.indexOf(input), 1);
        gameHomepage();
      } else {
        newLine(`${input} is not a currently used Map in your Game or press back.`)
      }
    }
  } else if (x == "addingMap") {
    if (y == 0) {
      if (input == "back") {
        clear();
        gameHomepage();
      } else if (input in mapDescriptions && !mapsUsed.includes(input)) {
        clear();
        newLine(`Are you sure that you want to add ${input} to your game?\n\nPlease enter the commands Yes or No.`);
        y = input;
        await loadMapData(y)
        openCanvas();
        loadMap(y, 0, 0, canvasWidth);
      } else if (mapsUsed.includes(input)) {
        clear();
        newLine(`${input} is already in use in this game, please select another Map.`)
        showListOfMaps();
      } else {
        clear();
        newLine("Unknown command. Please try again.");
        showListOfMaps();
      }
    } else {
      if (input == "yes") {
        x = "mapClarification";
        clear();
        checkForDialog(y);
        mapsUsed.push(y);
        y = 0;
      } else if (input == "no") {
        clear();
        showListOfMaps();
      }
    }
  } else if (x === "mapClarification") {
    waitForPlayerInput(); // Signal the async function to continue
    
  } else if (x == "playing") {
    if (input == "back") {
      y = 0;
      usingObject = false;
      showPlayerInfo();
    }
    if (y == 0) {
      if (input == "save") {
        outputField.style.textAlign = "left";
        let saveData = JSON.stringify([mapPlacements, currentMapPlacement, allMaps, globalVariables, inventory, data, mapsUsed, travellingMap, dialogsData]);
        outputField.innerHTML = "\nThis Save Data has also been copied to your Clipboard :\n\n" + saveData + "\n\nYou can enter Back to return.";
        navigator.clipboard.writeText(saveData);
      } else if (input == "use") {
        outputField.style.textAlign = "left";
        let output = `<h2>Using</h2>\nPlease enter the Number of the Item in your Inventory that you want to Use.\n\n`;
        for (let i = 0; i < Object.keys(inventory).length; i++) {
          let item = Object.keys(inventory)[i];
          output += `  ${i} - ${item}   x ${inventory[item]}\n`
        }
        outputField.innerHTML = output;
        y = "usingSelection"
      }
    } else if (y == "usingSelection") {
      if (!isNaN(parseInt(input))) {
        if (parseInt(input) < (Object.keys(inventory).length +1) && parseInt(input) > -1) {
          let usingObj = Object.keys(inventory)[parseInt(input)];
          if (inventory[usingObj] > 0) {
            // ADD AN IF HERE THAT FIGURES OUT IF YOU DONT NEED TO STATE THE DIRECTION AS DEFAULT IS YES
            clear();
            usingObject = usingObj;
            outputField.innerHTML = `<h2>Using</h2>\nPlease Move in the Direction that you want to Use the ${usingObj}.\n\nAlternativly you can enter Back to change your mind.`
          }
        }
      } 
    }
  } else if (x == "loading") {
    let saveData = JSON.parse(input);
    mapPlacements = saveData[0];
    currentMapPlacement = saveData[1];
    allMaps = saveData[2];
    globalVariables = saveData[3];
    inventory = saveData[4];
    data = saveData[5];
    mapsUsed = saveData[6];
    travellingMap = saveData[7];
    dialogsData = saveData[8];
    
    lowerCaseInput = true;
    x = "playing";
    clear();
    playing = true;
    play();
  }
}

async function checkForDialog(mapID) {
  
  let cellSize = canvasWidth/12;
  
  for (let i = 0; i < 144; i++) {
    
    if (data[mapID][i][1] != "" && data[mapID][i][1] != "void") {
      
      loadMap(mapID, 0, 0, canvasWidth);
      c.fillStyle = "rgba(255, 0, 0, 0.5)";
      c.fillRect(data[mapID][i][2] * cellSize, data[mapID][i][3] * cellSize, canvasWidth/12, canvasWidth/12);
      let objectType = data[mapID][i][1];
      clear();
      let condition = false;
      while (!condition) {
        try {
          newLine(`Please provide the name of the Dialog for this ${objectType} Object.\n\nIf you do not want this Object to have Dialog or be directly interacted with then Enter the command None.`);
          await new Promise(resolve => { waitForPlayerInput = resolve; });
          if (input != "none") {
            if (allDialogs.includes(input)) {
              data[mapID][i][6] = input;
              clear();
              break;
            } else {
              clear();
              newLine(`There is no Dialog: ${input}\n\nPlease try again.`)
            }
          }
        } catch (e) {
          clear();
          newLine(`There is no Dialog: ${input}\n\nPlease try again.`)
        }
      }
      
    }
  }
  
  loadMap(mapID, 0, 0, canvasWidth);
  
  let condition = false;
  let sides = ["Top", "Right", "Bottom", "Left"];
  clear();
  
  for (let i=0; i<sides.length; i++) {
    while (!condition) {
      try {
        let side = sides[i];
        let mapList = "";
        for (let i = 0; i < Object.keys(mapDescriptions).length; i++) {
          let mapID = `map${i}`
          mapList += `- Map${i} (${mapDescriptions[mapID]})\n`
        }
        newLine(`Please Enter the Maps connecting to the ${side} of this one.\n\nTo do this it needs to be in a certain format like so:\n\n["Map25"]\n\nWhat this means is that when you go to the ${side} of this Map and Move 1 more, you will travel to the other side of Map25.\n\nHowever if you wanted to add some randomness you can add multiple Maps to the ${side} of this one and 1 of these will be chosen fairly at random. This would have the format like so:\n\n["Map25" , "Map30"]\n\nThis means that when you travel to the ${side} of this Map and Move 1 more, you have a 50% chance of going to the other side of Map25 and a 50% chance of going to the other side of Map30.\n\nIt is worth noting that you can add a map multiple times to increase it's chance and you can also add the current Map allowing a Map to create a new copy on that side.\n\nAlternativly if you do not want the ${side} side to connect to any Map. Just enter:\n\n[]\n\nAll Maps to Use:\n\n` + mapList);
        await new Promise(resolve => { waitForPlayerInput = resolve; });
        data[mapID].push(JSON.parse(input));
        clear();
        break;
      } catch (e) {
        clear();
        newLine("Invalid format")
      }
    }
  }
  c.clearRect(0, 0, canvasWidth, canvasWidth);
  clear();
  showListOfMaps();
}


function loadMap (mapID, posX, posY, size) {
  
  //let cellSize = size / 12;
  let cellSize = Math.round(size / 12);
  let mapData
  
  if (playing) {
    mapData = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`];
  } else {
    mapData = data[mapID];
  }
  
  for (let i=0; i<144; i++) {
    c.drawImage(spriteSheets[mapData[i][0]], mapData[i][4].x * 16, mapData[i][4].y * 16, 16, 16, (posX + (mapData[i][2] * cellSize)), (posY + (mapData[i][3] * cellSize)), cellSize, cellSize);
    if (mapData[i][1] != "" && mapData[i][1] != "void") {
      c.drawImage(spriteSheets["objects"], mapData[i][5].x * 16, mapData[i][5].y * 16, 16, 16, (posX + (mapData[i][2] * cellSize)), (posY + (mapData[i][3] * cellSize)), cellSize, cellSize);
    }
  }
  
  enteringMap();
  
}

async function loadMapData (mapName) {
  await loadMapDataFromFile(mapName)
    .then(() => {
      data[mapName] = window[mapName]
      document.querySelector(`#${mapName}`).remove();
    })
    .catch(error => {
      console.error('Error loading map:', error);
    });
}

function loadMapDataFromFile(mapName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `../MapData/${mapName}.js`;
    script.id = mapName;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${mapName}.js`));
    document.head.appendChild(script);
  });
}

function showListOfMaps () {
  closeCanvas();
  let mapList = "";
  let usedMapList = ""
  for (let i = 0; i < Object.keys(mapDescriptions).length; i++) {
    let mapID = `map${i}`
    mapList += `- Map${i} (${mapDescriptions[mapID]})\n`
  }
  for (let i=0; i<mapsUsed.length; i++) {
    usedMapList += `- ${mapsUsed[i]}\n`
  }
  newLine("Please select a Map from the list below and enter it's number as a command to add it to your game. You can use the Command Back to return to this Games overview.\n\n" + mapList + "\n\nCurrently used Maps:\n\n" + usedMapList);
  x = "addingMap";
  y = 0;
}

function gameHomepage() {
  let usedMapList = "Here is a list of every Map used in this game so far:\n\n"
  for (let i = 0; i < Object.keys(data).length; i++) {
    usedMapList += `- ${mapsUsed[i]}\n`
  }
  newLine(`To Add a Map to your game simply use the Command Add.\n\nAlternativly to Remove a Map already in your game simply use the Command Remove\n\n` + usedMapList);
  x = "homepage";
  y = 0;
}

async function loadDialogData(dialogName) {
  await loadDialogFromFile(dialogName)
    .then(() => {
      dialogsData[dialogName] = window[dialogName]
      document.querySelector(`#${dialogName}`).remove();
    })
    .catch(error => {
      console.error('Error loading dialog:', error);
    });
}

function loadDialogFromFile(dialogName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `../Dialogs/${dialogName}.js`;
    script.id = dialogName;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${dialogName}.js`));
    document.head.appendChild(script);
  });
}

function play() {
  
  openCanvas();
  
  
  if (!playing) {
    currentMap = "";
    for (let i=0; i < Object.keys(data).length; i++) {
      let key = Object.keys(data)[i]
      for (let cell=0; cell<144; cell++) {
        if (data[key][cell][1].includes("PC")) {
          currentMap = key;
          break;
        }
      }
      if (currentMap != "") {
        break;
      }
    }
    mapPlacements["0x0"] = JSON.parse(JSON.stringify(data[currentMap]));
    currentMapPlacement = [0, 0];
  }
  playing = true;
  currentTurn = "PC";
  showPlayerInfo();
  loadMap("", 0, 0, canvasWidth);
}




window.addEventListener("keyup", (e) => {
  let key = e.key;
  if (key in gameKeys) {
    gameKeys[key] = false;
  }
})

window.addEventListener("keydown", (e) => {
  if (playing) {
    let key = e.key;
    if (key == "a" && gameKeys["a"] == false) {
      if (currentTurn == "PC") {
        if (usingObject == "" && !interacting) {
          let playerCell = returnObject(currentTurn)[0];
          objectMove({ x: playerCell[2], y: playerCell[3] }, [-1, 0])
          direction = [-1, 0];
          gameKeys["a"] = true
        } else if (usingObject !== "") {
          direction = [-1, 0];
          let cell = returnObject(currentTurn)[0];
          onUse(objectUses[usingObject], [-1, 0], [cell[2], cell[3]]);
          usingObject = "";
        }
      }
    }
    if (key == "s" && gameKeys["s"] == false) {
      if (currentTurn == "PC") {
        if (usingObject == "" && !interacting) {
          let playerCell = returnObject(currentTurn)[0];
          objectMove({ x: playerCell[2], y: playerCell[3] }, [0, 1]);
          direction = [0, 1];
          gameKeys["s"] = true
        } else if (usingObject !== "") {
          direction = [0, 1];
           let cell = returnObject(currentTurn)[0];
          onUse(objectUses[usingObject], [0, 1], [cell[2], cell[3]]);
          usingObject = "";
         }
      }
    }
    if (key == "d" && gameKeys["d"] == false) {
      if (currentTurn == "PC") {
        if (usingObject == "" && !interacting) {
          let playerCell = returnObject(currentTurn)[0];
          objectMove({ x: playerCell[2], y: playerCell[3] }, [1, 0]);
          direction = [1, 0];
          gameKeys["d"] = true
        } else if (usingObject !== "") {
           let cell = returnObject(currentTurn)[0];
          direction = [1, 0];
          onUse(objectUses[usingObject], [1, 0], [cell[2], cell[3]]);
          usingObject = "";
         }
      }
    }
    if (key == "w" && gameKeys["w"] == false) {
      if (currentTurn == "PC") {
        if (usingObject == "" && !interacting) {
          let playerCell = returnObject(currentTurn)[0];
          objectMove({ x: playerCell[2], y: playerCell[3] }, [0, -1]);
          direction = [0, -1];
          gameKeys["w"] = true
        } else if (usingObject !== "") {
           let cell = returnObject(currentTurn)[0];
          direction = [0, -1];
          onUse(objectUses[usingObject], [0, -1], [cell[2], cell[3]]);
          usingObject = "";
         }
      }
    }
    if (key == "e" && gameKeys["e"] == false) {
      if (currentTurn == "PC") {
        if (usingObject == "" && !interacting) {
          gameKeys["e"] = true;
          let playerCell = returnObject(currentTurn)[0];
          let dialogFromCell = returnCell(playerCell[2] + direction[0], playerCell[3] + direction[1])[6];
          currentDialog = dialogFromCell;
          if (dialogFromCell != "") {
            interact(returnCell(playerCell[2] + direction[0], playerCell[3] + direction[1]));
          }
        }
      }
    }
  }
})


function enteringMap () {
  let cP = returnObject("CP");
  for (let i=0; i<cP.length; i++) {
    let obj = `${travellingMap}-${currentMapPlacement[0]}x${currentMapPlacement[1]}-${cP[i][2]}x${cp[i][3]}`
    if (!(obj in objectVariables)) {
      objectVariables[obj] = objectUses[cp[i][1]]
    }
  }
  let cE = returnObject("CE");
  for (let i = 0; i < cE.length; i++) {
    let obj = `${travellingMap}-${currentMapPlacement[0]}x${currentMapPlacement[1]}-${cP[i][2]}x${cp[i][3]}`
    if (!(obj in objectVariables)) {
      objectVariables[`${travellingMap}-${currentMapPlacement[0]}x${currentMapPlacement[1]}-${cE[i][2]}x${cE[i][3]}`] = objectUses[cE[i][1]];
    }
  }
  
}



function onUse(obj, dir, userPos) {
  
  let affectingCells = []; // AN ARRAY OF CELLS SUCH AS 4X3 OR 8X11 WHICH ARE THE CELLS THAT THIS TARGET AND AFFECT.
  
  let radii = [
    [[0,0]], // RADIUS = 0
    [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]], // RADIUS = 1
    [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1], [-2, 0], [-1, -1]], // RADIUS = 2
    [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [0, -2], [1, -1], [2, 0], [1, 1], [0, 2], [-1, 1], [-2, 0], [-1, -1], [0, -3], [1, -2], [2, -1], [3, 0], [2, 1], [1, 2], [0, 3], [-1, 2], [-2, 1], [-3, 0], [-2, -1], [-1, -2]] // RADIUS = 3
  ]
  
  for (let i=0; i<radii[obj["radius"]].length; i++) {
    let cell = radii[obj["radius"]][i];
    cell[0] += dir[0] * obj["range"] + userPos[0];
    cell[1] += dir[1] * obj["range"] + userPos[1];
    affectingCells.push(cell);
  }
  
  
  for (let cell=0; cell<affectingCells.length; cell++) {
    let dataToChange
    let cellD = returnCell(affectingCells[cell][0], affectingCells[cell][1])
    if (cellD[1] != "") {
      if (cellD[1].includes("PC")) {
        dataToChange = globalVariables;
      } else {
        dataToChange = objectVariables[`${travellingMap}-${currentMapPlacement[0]}x${currentMapPlacement[1]}-${cellD[2]}x${cellD[3]}`];
      }
      
      
      if ("damage" in obj) {
        dataToChange["hp"] -= obj["damage"];
        if (dataToChange["hp"] == 0) {
          // DELETE OBJECT TO DO
        }
      }
      
      
    }
  }
  
  
}
  


async function interact (cellInteractingWith) {
  interacting = true;
  await loadDialogData(currentDialog);
  outputField.style.textAlign = "center";
  dialogHistory = [];
  dialogTracker  = 0;
  while (interacting) {
    let output = "\n";
    let skip = false;
    // ADDING CURRENT PART OF DIALOG BASED ON TRACKER TO THE DIALOG HISTORY
    dialogHistory.push(dialogsData[currentDialog][dialogTracker])
      //dialogHistory.push(["speech", ])
    
    // CREATING DIALOG BASED ON DIALOGHISTORY
    for (let i=0; i<dialogHistory.length; i++) {
      if (dialogHistory[i][0] == "speech") {
        let txt = eval("`" + dialogHistory[i][2] + "`");
        output += `<u>${dialogHistory[i][1]}</u>\n${txt}\n\n`;
      } else if (dialogHistory[i][0] == "choice") {
        if (dialogHistory[i][1].length == 1) {
          output += "<hr>\nChoice: " + dialogHistory[i][1][0][0] + "\n\n<hr>\n"
        } else {
          for (let j=0; j<dialogHistory[i][1].length; j++) {
            output += `<button class='dialogButton' onclick='choiceDialog(${JSON.stringify(dialogHistory[i][1][j])})'>${dialogHistory[i][1][j][0]}</button>\n\n`
          }
        }
      }
    }
    
    // ADDING BUTTONS TO END OF DIALOG BASED ON END OF DIALOG HISTORY
    
    let recentDialog = dialogHistory[dialogHistory.length - 1]
    
    if (recentDialog[0] == "jump") {
      dialogTracker = recentDialog[1];
      skip = true;
    }
    
    if (recentDialog[0] == "travel") {
      allMaps[travellingMap] = [mapPlacements, currentMapPlacement];
      if (!(recentDialog[1] in allMaps)) {
        loadMapData(recentDialog[2]);
        allMaps[recentDialog[1]] = [{"0x0" : data[recentDialog[2]]} , [0, 0]]
      }
      travellingMap = recentDialog[1]
      mapPlacements = allMaps[travellingMap][0];
      currentMapPlacement = allMaps[travellingMap][1]
      loadMap("", 0, 0, canvasWidth);
      interacting = false;
      skip = true;
      
    }
    
    if (recentDialog[0] == "swap") {
      if (objects.includes(recentDialog[1]) && objects.includes(recentDialog[2]) && allDialogs.includes(recentDialog[3])) {
        for (let cell=0; cell<144; cell++) {
          let currentCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][cell]
          if (currentCell[1] == recentDialog[1]) {
            currentCell[1] = recentDialog[2];
            currentCell[5] = objectList[recentDialog[2]];
            currentCell[6] = recentDialog[3];
          }
        }
        dialogTracker++;
        loadMap("", 0, 0, canvasWidth);
        skip = true;
      }
    }
    
    if (recentDialog[0] == "add") {
      if (objects.includes(recentDialog[1])) {
        if (recentDialog[1] in inventory) {
          inventory[recentDialog[1]] += recentDialog[2];
        } else {
          inventory[recentDialog[1]] = recentDialog[2];
        }
      } else {
        if (recentDialog[1] in globalVariables) {
          globalVariables[recentDialog[1]] += recentDialog[2];
        } else {
          globalVariables[recentDialog[1]] = recentDialog[2];
        }
      }
      dialogTracker++;
      skip = true;
    }
    
    if (recentDialog[0] == "reduce") {
      if (recentDialog[1] in inventory) {
        if (inventory[recentDialog[1]] > (recentDialog[2] - 1)) {
          inventory[recentDialog[1]] -= recentDialog[2];
        } else {
          delete inventory[recentDialog[1]];
        }
      } else if (recentDialog[1] in globalVariables) {
        if (globalVariables[recentDialog[1]] > (recentDialog[2] - 1)) {
          globalVariables[recentDialog[1]] -= recentDialog[2];
        } else {
          globalVariables[recentDialog[1]] = 0;
        }
      }
      dialogTracker++;
      skip = true;
    }
    
    if (recentDialog[0] == "count") {
      if (recentDialog[1] in inventory) {
        if (inventory[recentDialog[1]] > (recentDialog[2] - 1)) {
          dialogTracker = recentDialog[3];
        } else {
          dialogTracker = recentDialog[4];
        }
      } else if (recentDialog[1] in globalVariables) {
        if (globalVariables[recentDialog[1]] > (recentDialog[2] - 1)) {
          dialogTracker = recentDialog[3];
        } else {
          dialogTracker = recentDialog[4];
        }
      }
      skip = true;
    }
    
    if (recentDialog[0] == "destroy") {
      cellInteractingWith[1] = "";
      cellInteractingWith[5] = {};
      cellInteractingWith[6] = "";
      loadMap("", 0, 0, canvasWidth);
      dialogTracker++;
      skip = true;
    }
    
    if (recentDialog[0] == "end") {
      output += "<button class='dialogButton' onclick='endDialog()'>End Dialog</button>"
    }
    
    if (recentDialog[0] == "speech") {
      if (dialogsData[currentDialog][dialogTracker + 1][0] != "end") {
        output += "<button class='dialogButton' onclick='continueDialog()'>Continue</button>";
      } else {
        output += "<button class='dialogButton' onclick='endDialog()'>End Dialog</button>"
      }
    }
    
    
    outputField.innerHTML = output;
    
    if (!skip) {
      outputField.scrollTop = outputField.scrollHeight;
      await new Promise(resolve => { waitForPlayerInput = resolve; });
    }
  }
  showPlayerInfo();
  dialogTracker = 0;
}

function showPlayerInfo () {
  outputField.style.textAlign = "left";
  info = "<h2>Stats</h2>\n\n";
  info += `<b>Current Life</b> : ${globalVariables["hp"]} / ${globalVariables["maxhp"]}\n<b>Current Mana</b> : ${globalVariables["mana"]} / ${globalVariables["maxmana"]}\n\n<b>Currently Equipped</b> : ${equipped}\n\n<b>Inventory</b> :\n\n`;
  for (let i=0; i<Object.keys(inventory).length; i++) {
    let item = Object.keys(inventory)[i];
    info += `  - ${item}   x ${inventory[item]}\n`
  }
  outputField.innerHTML = info;
}

function continueDialog() {
  dialogTracker ++;
  waitForPlayerInput();
}

function choiceDialog (choiceArray) {
  dialogHistory[(dialogHistory.length - 1)] = ["choice", [choiceArray]];
  dialogTracker = choiceArray[1];
  waitForPlayerInput();
}

function endDialog () {
  interacting = false;
  waitForPlayerInput();
}


function returnObject(objectName) {
  // OBJECT NAME CAN BE ANY NAME LIKE PLAYER1 OR HOUSE. THIS WILL RETURN THE FIRST CELL WITH IT IN THE CURRENT MAP
  let list = []
  for (let cell = 0; cell < 144; cell++) {
    if (objectName == "PC" || objectName == "CP" || objectName == "CE"){
      if (mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][cell][1].includes(objectName)) {
        list.push(mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][cell]);
      }
    }
    if (mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][cell][1] == objectName) {
      list.push(mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][cell])
    }
  }
  
  return list;
}

function returnCell (cellX, cellY) {
  return mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(cellY * 12) + cellX];
}




function objectMove(objSrc, direction) {
  // OBJSRC IS THE {X : 2, Y : 3} FOR THE OBJECTS POSITION
  // DIRECTION = [1, 0] TO MOVE RIGHT FOR EXAMPLE
  let targetCell = { x: objSrc.x + direction[0], y: objSrc.y + direction[1] }
  if (targetCell.x < 12 && targetCell.y < 12 && targetCell.x > -1 && targetCell.y > -1) { // IF MOVING TO A VALID SQAURE INSIDE MAP
    if (returnCell(targetCell.x, targetCell.y)[1] == "") { // IF THERE IS NO OBJECT AT TARGET CELL
      let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
      let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
      newCell[1] = oldCell[1];
      oldCell[1] = "";
      newCell[5] = oldCell[5]
      oldCell[5] = {};
      newCell[6] = oldCell[6];
      oldCell[6] = "";
    }
  } else {
    // IF TRYING TO MOVE OUTSIDE MAP
    if (direction[0] == -1 && direction[1] == 0) { // IF GOING LEFT
      if (`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}` in mapPlacements) {
        // IF MOVING LEFT INTO MAP THAT ALREADY EXISTS
        let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
        let tempX = currentMapPlacement[0];
        let tempY = currentMapPlacement[1];
        currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
        if (returnCell(11, objSrc.y)[1] == "") {
          // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON RIGHT SIDE
          let targetCell = { x: 11, y: objSrc.y }
          let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
          newCell[1] = oldCell[1];
          oldCell[1] = "";
          newCell[5] = oldCell[5]
          oldCell[5] = {};
          newCell[6] = oldCell[6];
          oldCell[6] = "";
        }
        loadMap("", 0, 0, canvasWidth);
      } else {
        // IF MOVING LEFT INTO MAP THAT DOESNT EXIST YET
        let mapData = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`];
        if (mapData[147].length > 0) {
          let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
          currentMap = mapData[147][Math.floor(Math.random() * mapData[147].length)];
          mapPlacements[`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}`] = JSON.parse(JSON.stringify(data[currentMap]));
          let tempX = currentMapPlacement[0];
          let tempY = currentMapPlacement[1];
          currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
          
          if (returnCell(11, objSrc.y)[1] == "") { 
            // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON RIGHT SIDE
            let targetCell = { x : 11, y : objSrc.y }
            let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
            newCell[1] = oldCell[1];
            oldCell[1] = "";
            newCell[5] = oldCell[5]
            oldCell[5] = {};
            newCell[6] = oldCell[6];
            oldCell[6] = "";
          }
          loadMap("", 0, 0, canvasWidth);
        }
      }
    } else if (direction[0] == 1 && direction[1] == 0) {  // IF GOING RIGHT
      if (`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}` in mapPlacements) {
        // IF MOVING RIGHT INTO MAP THAT ALREADY EXISTS
        let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
        let tempX = currentMapPlacement[0];
        let tempY = currentMapPlacement[1];
        currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
        if (returnCell(0, objSrc.y)[1] == "") {
          // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON LEFT SIDE
          let targetCell = { x: 0, y: objSrc.y }
          let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
          newCell[1] = oldCell[1];
          oldCell[1] = "";
          newCell[5] = oldCell[5]
          oldCell[5] = {};
          newCell[6] = oldCell[6];
          oldCell[6] = "";
        }
        loadMap("", 0, 0, canvasWidth);
      } else {
        // IF MOVING RIGHT INTO MAP THAT DOESNT EXIST YET
        let mapData = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`];
        if (mapData[145].length > 0) {
          let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
          currentMap = mapData[145][Math.floor(Math.random() * mapData[145].length)];
          mapPlacements[`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}`] = JSON.parse(JSON.stringify(data[currentMap]));
          let tempX = currentMapPlacement[0];
          let tempY = currentMapPlacement[1];
          currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
    
          if (returnCell(0, objSrc.y)[1] == "") {
            // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON LEFT SIDE
            let targetCell = { x: 0, y: objSrc.y }
            let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
            newCell[1] = oldCell[1];
            oldCell[1] = "";
            newCell[5] = oldCell[5]
            oldCell[5] = {};
            newCell[6] = oldCell[6];
            oldCell[6] = "";
          }
          loadMap("", 0, 0, canvasWidth);
        }
      }
    } else if (direction[0] == 0 && direction[1] == -1) { // IF GOING UP
       if (`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}` in mapPlacements) {
         // IF MOVING UP INTO MAP THAT ALREADY EXISTS
         let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
         let tempX = currentMapPlacement[0];
         let tempY = currentMapPlacement[1];
         currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
         if (returnCell(objSrc.x, 11)[1] == "") {
           // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON BOTTOM SIDE
           let targetCell = { x: objSrc.x, y: 11 }
           let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
           newCell[1] = oldCell[1];
           oldCell[1] = "";
           newCell[5] = oldCell[5]
           oldCell[5] = {};
           newCell[6] = oldCell[6];
           oldCell[6] = "";
         }
         loadMap("", 0, 0, canvasWidth);
       } else {
         // IF MOVING UP INTO MAP THAT DOESNT EXIST YET
         let mapData = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`];
         if (mapData[144].length > 0) {
           let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
           currentMap = mapData[144][Math.floor(Math.random() * mapData[144].length)];
           mapPlacements[`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}`] = JSON.parse(JSON.stringify(data[currentMap]));
           let tempX = currentMapPlacement[0];
           let tempY = currentMapPlacement[1];
           currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
    
           if (returnCell(objSrc.x, 11)[1] == "") {
             // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON BOTTOM SIDE
             let targetCell = { x: objSrc.x, y: 11 }
             let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
             newCell[1] = oldCell[1];
             oldCell[1] = "";
             newCell[5] = oldCell[5]
             oldCell[5] = {};
             newCell[6] = oldCell[6];
             oldCell[6] = "";
           }
           loadMap("", 0, 0, canvasWidth);
         }
       }
     } else if (direction[0] == 0 && direction[1] == 1) { // IF GOING DOWN
        if (`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}` in mapPlacements) {
          // IF MOVING DOWN INTO MAP THAT ALREADY EXISTS
          let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
          let tempX = currentMapPlacement[0];
          let tempY = currentMapPlacement[1];
          currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
          if (returnCell(objSrc.x, 0)[1] == "") {
            // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON TOP SIDE
            let targetCell = { x: objSrc.x, y: 0 }
            let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
            newCell[1] = oldCell[1];
            oldCell[1] = "";
            newCell[5] = oldCell[5]
            oldCell[5] = {};
            newCell[6] = oldCell[6];
            oldCell[6] = "";
          }
          loadMap("", 0, 0, canvasWidth);
        } else {
          // IF MOVING DOWN INTO MAP THAT DOESNT EXIST YET
          let mapData = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`];
          if (mapData[146].length > 0) {
            let oldCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(objSrc.y * 12) + objSrc.x];
            currentMap = mapData[146][Math.floor(Math.random() * mapData[146].length)];
            mapPlacements[`${currentMapPlacement[0] + direction[0]}x${currentMapPlacement[1] + direction[1]}`] = JSON.parse(JSON.stringify(data[currentMap]));
            let tempX = currentMapPlacement[0];
            let tempY = currentMapPlacement[1];
            currentMapPlacement = [tempX + direction[0], tempY + direction[1]]
     
            if (returnCell(objSrc.x, 0)[1] == "") {
              // IF THERE IS NO OBJECT AT TARGET CELL ON NEXT MAP ON TOP SIDE
              let targetCell = { x: objSrc.x, y: 0 }
              let newCell = mapPlacements[`${currentMapPlacement[0]}x${currentMapPlacement[1]}`][(targetCell.y * 12) + targetCell.x];
              newCell[1] = oldCell[1];
              oldCell[1] = "";
              newCell[5] = oldCell[5]
              oldCell[5] = {};
              newCell[6] = oldCell[6];
              oldCell[6] = "";
            }
            loadMap("", 0, 0, canvasWidth);
          }
        }
      }
  }
  loadMap("", 0, 0, canvasWidth);
  5, 6
}

function nextTurn() {
  currentTurn = "PC"
  
}


gamemaker();