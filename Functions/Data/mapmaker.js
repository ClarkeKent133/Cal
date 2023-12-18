// WHEN ADDING OBJECT TO SPRITE SHEET. ADD IT TO OBJECTS[] IN MAIN.JSAND GRABOBJECT() CONST.
// WHEN ADDING NEW MAP SPRITESHEET ADD IT TO TILES[] IN MAPMAKER() AND SPRITESHEETS{} IN MAIN.JS.

// VARIABLE DECLERATION ->

if (typeof data == 'undefined') {
  let data;
  let grid_size;
  let cell_size;
  let tiles;
  let summary;
}

// <- VARIABLE DECLERATION



class Cell {
  constructor (positionX, positionY, width, intX, intY) {
    this.position = {
      x : positionX,
      y : positionY
    }
    this.width = width;
    this.colour = "white";
    this.tile = "";
    this.object = "";
    this.intX = intX;
    this.intY = intY;
    this.spriteTileCutting = {};
    this.spriteObjectCutting = {};
    this.dialogName = "";
  }
  
  draw () {
    c.fillStyle = this.colour;
    c.fillRect(this.position.x, this.position.y, cell_size, cell_size);
    if (this.tile != "") {
      if (cellAutoTiling(this.intX, this.intY) != false) {
        this.spriteTileCutting = cellAutoTiling(this.intX, this.intY);
      }
      c.drawImage(spriteSheets[this.tile], this.spriteTileCutting.x * 16, this.spriteTileCutting.y * 16, 16, 16, this.position.x, this.position.y, this.width, this.width);
      if (this.object != "") {
        c.drawImage(spriteSheets["objects"], this.spriteObjectCutting.x * 16, this.spriteObjectCutting.y * 16, 16, 16, this.position.x, this.position.y, this.width, this.width);
      }
    }
  }
  
  update () {
    if (keys['leftMouse'] && (keys['mousePos'].x > this.position.x && keys['mousePos'].x < (this.position.x + cell_size) && keys['mousePos'].y > this.position.y && keys['mousePos'].y < (this.position.y + cell_size))) {
      
      if (x == "Tiles") {
        if (y != 0 && y != "none") {
          this.tile = y;
        } else if (y == "none") {
          this.tile = ""
        }
      } else if (x == "Objects") {
        if (y != 0 && y != "none") {
          if (objects.includes(y)) {
            this.object = y;
            this.spriteObjectCutting = grabObject(y);
          }
        }  else if (y == "none") {
          this.object = "";
        }
      }
    }
  }
  
  save () {
    let saveOutput = [this.tile, this.object, this.intX, this.intY, this.spriteTileCutting, this.spriteObjectCutting, this.dialogName];
    
    return saveOutput
  }
} // FOR SAVING YOU NEED THIS.TILE, THIS.INTX, THIS.INTY, THIS.SPRITECUTTING



function mapmaker() {
  
  if (input == "mapmaker") {
    data = {};
    summary = 'As a summary of what the Map Maker is, this allows you to create by default 12x12 maps to use in your game. Maps are compromised of tiles which are not interactable and form the ground. Objects however cannot pass through each other and can be static or kinetic and form all functionality of the game.\n\nTo place either Objects or Tiles, simply enter your choice below as a command.\n\nThe list of all available Objects and Tiles are provided and you simply have to enter the name of your chosen type as a command to select it. It will then confirm the currently active Tile type or Object and you can tap or click the squares on the map to the left to place them. Each square on the map can contain only 1 Tile and only 1 Object. Objects are placed ontop of their Tile.\n\nTo Save the current map that you have created just enter the command Save and it will display the save data here and also copy it to your clipboard to use in your game.\n\nTo return to Cal just enter the command Exit.'
    tiles = ["none", "blackBorder", "grass", "water"];
    openCanvas();
    grid_size = 12;
    cell_size = (canvasWidth - (grid_size + 1)) / grid_size;
    for (let y=0; y<grid_size; y++) {
      for (let x=0; x<grid_size; x++) {
        data[`${x}x${y}`] = new Cell((x * cell_size) + x + 1, (y * cell_size) + y + 1, cell_size, x, y);
      }
    }
  }
  
  if (!canvasAnimating) {
    canvasAnimating = true;
    animate();
  }
  
  if (x == 0) {
    if (input == 'mapmaker') {
      clear();
      newLine('Welcome to the Map Maker !!');
      newLine(summary);
    } else if (input == "tiles") {
      x = "Tiles";
      lowerCaseInput = false;
      clear();
      newLine("Selected Type: Tiles\nSelected Tile: N/A\n\n" + generateTileList() + '\n\nTo return and use the other functionality you can enter the command Back.');
    } else if (input == "objects") {
      x = "Objects";
      lowerCaseInput = false;
      clear();
      newLine("Selected Type: Objects\nSelected Object: N/A\n\n" + generateObjectList() + '\n\nTo return and use the other functionality you can enter the command Back.');
    } else if (input == "save") {
      x = "saving";
      clear();
      newLine("Please enter the name you would like this map to be.\n\nThis is usually something like map15 or map27.");
    } else if (input == "load") {
      clear();
      newLine("Please enter the Data to Load into the box below as a command and hit Enter.");
      x = "Loading";
    }
  } else if (x == "saving") {
    
    let saveDataArray = []
    for (let i = 0; i < Object.keys(data).length; i++) {
      let dataCell = data[Object.keys(data)[i]];
      saveDataArray.push(dataCell.save())
    }
    let saveData = `var ${input} = ` + JSON.stringify(saveDataArray);
    clear();
    newLine(`Saved Data copied to Clipboard:\n\n` + saveData);
    navigator.clipboard.writeText(saveData);
    
  } else if (x == "Tiles") {
    lowerCaseInput = true;
    if (input == "back") {
      x = 0;
      y = 0;
      clear();
      newLine('Welcome to the Map Maker !!');
      newLine(summary);
    } else if (tiles.includes(input)) {
      y = input;
      clear();
      newLine(`Selected Type: Tiles\n\nSelected Tile: ${y}\n\n` + generateTileList() + '\n\nTo return and use the other functionality you can enter the command Back.')
    } else {
      clear();
      newLine('Unknown Tile type, please try again or press Back to go back to the start.');
    }
  } else if (x == "Objects") {
    lowerCaseInput = true;
    if (input == "back") {
      x = 0;
      y = 0;
      clear();
      newLine('Welcome to the Map Maker !!');
      newLine(summary);
    } else if (objects.includes(input)) {
      y = input;
      clear();
      newLine(`Selected Type: Objects\nSelected Object: ${y}\n\n` + generateObjectList() + '\n\nTo return and use the other functionality you can enter the command Back.');
    } else {
      clear();
      newLine("Unknown Object type, please try again or press Back to go back to the start.");
    }
    
  } else if (x == "Loading") {
    let parsedData = JSON.parse(input);
    for (let i=0; i<parsedData.length; i++) {
      let cellToSwap = data[`${parsedData[i][2]}x${parsedData[i][3]}`]
      cellToSwap.tile = parsedData[i][0];
      cellToSwap.object = parsedData[i][1];
      cellToSwap.spriteTileCutting = parsedData[i][4];
      cellToSwap.spriteObjectCutting = parsedData[i][5];
      cellToSwap.dialogName = parsedData[i][6];
    }
    x = 0;
    clear()
    newLine('Welcome to the Map Maker !!');
    newLine(summary);
  }
}

function generateTileList() {
  let output = "All Tiles:\n";
  for (let i=0; i<tiles.length; i++) {
    output += `- ${tiles[i]}\n`
  }
  return output;
}

function generateObjectList() {
  let output = "All Objects:\n";
  for (let i = 0; i < objects.length; i++) {
    output += `- ${objects[i]}\n`
  }
  return output;
}

function grabObject(obj) {
  const objectList = {
    "void" : {x : 0, y : 0},
    "flower" : {x : 1, y : 0},
    "house" : {x : 2, y : 0},
    "player1" : {x : 3, y : 0}
  }
  if (obj in objectList) {
    return objectList[obj];
  } else {
    return false;
  }
}


function cellAutoTiling(cellX, cellY) {
  let hCode = "";
  let dCode = "";
  let cellTile = data[`${cellX}x${cellY}`].tile;
  const hArrangements = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const dArrangements = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const hAutoTiling = {
    "0000" : {x : 1, y : 1},
    "0001" : {x : 6, y : 0},
    "0010" : {x : 3, y : 0},
    "0011" : {x : 2, y : 0},
    "0100" : {x : 4, y : 0},
    "0101" : {x : 5, y : 0},
    "0110" : {x : 0, y : 0},
    "0111" : {x : 1, y : 0},
    "1000" : {x : 3, y : 2},
    "1001" : {x : 2, y : 2},
    "1010" : {x : 3, y : 1},
    "1011" : {x : 2, y : 1},
    "1100" : {x : 0, y : 2},
    "1101" : {x : 1, y : 2},
    "1110" : {x : 0, y : 1},
    "1111" : {x : 8, y : 3},
  }
  const dAutoTiling = {
    "0000" : {x : 8, y : 1},
    "0001" : {x : 7, y : 2},
    "0010" : {x : 9, y : 2},
    "0011" : {x : 8, y : 2},
    "0100" : {x : 9, y : 0},
    "0101" : {x : 6, y : 2},
    "0110" : {x : 9, y : 1},
    "0111" : {x : 5, y : 2},
    "1000" : {x : 7, y : 0},
    "1001" : {x : 7, y : 1},
    "1010" : {x : 6, y : 1},
    "1011" : {x : 4, y : 2},
    "1100" : {x : 8, y : 0},
    "1101" : {x : 4, y : 1},
    "1110" : {x : 5, y : 1},
    "1111" : {x : 8, y : 3},
  }
  
  for (let i=0; i<hArrangements.length; i++) {
    if (data[`${cellX + hArrangements[i][0]}x${cellY + hArrangements[i][1]}`]) {
      if (cellTile == data[`${cellX + hArrangements[i][0]}x${cellY + hArrangements[i][1]}`].tile) {
        hCode += "1";
      } else {
        hCode += "0";
      }
    } else {
      hCode += "1";
    }
  }
  
  for (let i = 0; i < dArrangements.length; i++) {
    if (data[`${cellX + dArrangements[i][0]}x${cellY + dArrangements[i][1]}`]) {
      if (cellTile == data[`${cellX + dArrangements[i][0]}x${cellY + dArrangements[i][1]}`].tile) {
        dCode += "1";
      } else {
        dCode += "0";
      }
    } else {
      dCode += "1";
    }
  }
  
  if (hCode == "1111") {
    return dAutoTiling[dCode];
  }
  
  
  if (hCode == "0110" && dCode[2] == "0") {
    return {x : 6, y : 3}
  } else if (hCode == "0011" && dCode[3] == "0") {
    return { x: 7, y: 3 }
  } else if (hCode == "1001" && dCode[0] == "0") {
    return { x: 7, y: 4 }
  } else if (hCode == "1100" && dCode[1] == "0") {
    return { x: 6, y: 4 }
  } else if (hCode == "0111" && dCode[3] == "0" && dCode[2] == "1") {
    return { x: 3, y: 3 }
  } else if (hCode == "0111" && dCode[3] == "1" && dCode[2] == "0") {
    return { x: 4, y: 3 }
  } else if (hCode == "0111" && dCode[3] == "0" && dCode[2] == "0") {
    return { x: 5, y: 3 }
  } else if (hCode == "1011" && dCode[0] == "0" && dCode[3] == "1") {
    return { x: 0, y: 4 }
  } else if (hCode == "1011" && dCode[0] == "1" && dCode[3] == "0") {
    return { x: 1, y: 4 }
  } else if (hCode == "1011" && dCode[0] == "0" && dCode[3] == "0") {
    return { x: 2, y: 4 }
  } else if (hCode == "1101" && dCode[0] == "0" && dCode[1] == "1") {
    return { x: 3, y: 4 }
  } else if (hCode == "1101" && dCode[0] == "1" && dCode[1] == "0") {
    return { x: 4, y: 4 }
  } else if (hCode == "1101" && dCode[0] == "0" && dCode[1] == "0") {
    return { x: 5, y: 4 }
  } else if (hCode == "1110" && dCode[1] == "0" && dCode[2] == "1") {
    return { x: 0, y: 3 }
  } else if (hCode == "1110" && dCode[1] == "1" && dCode[2] == "0") {
    return { x: 1, y: 3 }
  } else if (hCode == "1110" && dCode[1] == "0" && dCode[2] == "0") {
    return { x: 2, y: 3 }
  } else {
    return hAutoTiling[hCode];
  }
  
}


function clearCanvas() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvasWidth, canvasHeight);
}



function animate() {
  if (canvasAnimating) {
    clearCanvas();
    for (let i = 0; i < Object.keys(data).length; i++) {
      data[Object.keys(data)[i]].draw();
      data[Object.keys(data)[i]].update();
    }
    requestAnimationFrame(animate);
  }
}



mapmaker();
