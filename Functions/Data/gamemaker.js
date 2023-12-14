if (typeof data == 'undefined') { // VARIABLE DECLERATION
  let data;
  let mapsUsed;
  let mapNo;
  let mapDescriptions;
  let objectUses;
  let waitForPlayerInput;
}



async function gamemaker () {
  if (x == 0) {
    if (input == "gamemaker") {
      mapNo = 1;
      mapsUsed = [];
      data = {};
      waitForPlayerInput = () => {};
      mapDescriptions = {
        "map0" : "A baren field with a house and a single Player."
      }
      objectUses = {
      
      };
      //openCanvas();
      clear();
      newLine("Welcome to the Game Maker !!\n\nWould you like to create a new game or load one from save data? To choose please enter the commands New or Load.");
    } else if (input == "new") {
      clear();
      gameHomepage();
    }
  } else if (x == "homepage") {
    if (input == "add") {
      clear();
      showListOfMaps();
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
        newLine(`Please Enter the Maps connecting to the ${side} of this one.\n\nTo do this it needs to be in a certain format like so:\n\n["Map25"]\n\nWhat this means is that when you go to the ${side} of this Map and Move 1 more, you will travel to the other side of Map25.\n\nHowever if you wanted to add some randomness you can add multiple Maps to the ${side} of this one and 1 of these will be chosen fairly at random. This would have the format like so:\n\n["Map25" , "Map30"]\n\nThis means that when you travel to the ${side} of this Map and Move 1 more, you have a 50% chance of going to the other side of Map25 and a 50% chance of going to the other side of Map30.\n\nIt is worth noting that you can add a map multiple times to increase it's chance and you can also add the current Map allowing a Map to create a new copy on that side.\n\nAlternativly if you do not want the ${side} side to connect to any Map. Just enter:\n\n[]`);
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
  
  let cellSize = size / 12;
  
  let mapData = data[mapID];
  for (let i=0; i<144; i++) {
    c.drawImage(spriteSheets[mapData[i][0]], mapData[i][4].x * 16, mapData[i][4].y * 16, 16, 16, (posX + (mapData[i][2] * cellSize)), (posY + (mapData[i][3] * cellSize)), cellSize, cellSize);
    if (mapData[i][1] != "" && mapData[i][1] != "void") {
      c.drawImage(spriteSheets["objects"], mapData[i][5].x * 16, mapData[i][5].y * 16, 16, 16, (posX + (mapData[i][2] * cellSize)), (posY + (mapData[i][3] * cellSize)), cellSize, cellSize);
    }
  }
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
  for (let i = 0; i < mapNo; i++) {
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
  newLine(`To Add a Map to your game simply use the Command Add.\n\nTo Edit a Map already in your game simply use the Command Edit\n\nTo Remove a Map already in your game simply use the Command Remove\n\n` + usedMapList);
  x = "homepage";
  y = 0;
}




gamemaker();