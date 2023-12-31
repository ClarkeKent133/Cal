// VARIABLE DECLERATION ->

if (typeof data == 'undefined') {
  let data;
  let playerSpeed;
}

// <- VARIABLE DECLERATION

// OBJ CLASS ->

class TopDownObj {
  constructor (positionX, positionY, width, height, type, passThrough, image) {
    this.position = {
      x : positionX,
      y : positionY
    }
    this.velocity = {
      x : 0,
      y : 0
    }
    this.width = width;
    this.height = height;
    this.type = type;
    this.passThrough = passThrough;
    this.image = image;
    
    if (this.type == 'player') this.colour = 'blue';
    else if (this.type == 'static') this.colour = 'red';
    
    data.push(this)
  }
  
  draw () {
    c.fillStyle = this.colour;
    if (this.type == 'player') {
      this.position.x = (canvasWidth/2)-(this.width/2);
      this.position.y = (canvasHeight/2)-(this.height/2);
    }
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  
  update() {
    if (this.type != 'player') {
      if (keys['a']) {
        this.velocity.x = 1;
      }
      if (keys['d']) {
        this.velocity.x = -1;
      }
      if ((keys['a'] && keys['d']) || (!keys['a'] && !keys['d'])) this.velocity.x = 0;
      if (keys['w']) {
        this.velocity.y = 1;
      }
      if (keys['s']) {
        this.velocity.y = -1;
      }
      if ((keys['w'] && keys['s']) || (!keys['w'] && !keys['s'])) this.velocity.y = 0;
      
      this.velocity = normalize(this.velocity);
      
      this.position.x += this.velocity.x * playerSpeed;
      this.position.y += this.velocity.y * playerSpeed;
    }
  }
}

// <- OBJ CLASS


function game() {
  
  // OPENING CANVAS ->
  
  openCanvas();
  
  
  // <- OPENING CANVAS
  
  if (input == 'game') { // IF FUNCTION NAME CHANGES SO DOES THIS !!!!!!!!!!!!!!!!
    data = [];
    playerSpeed = 3;
    const player = new TopDownObj(0, 0, 20, 20, 'player', false, '');
    const tree = new TopDownObj(30, 30, 15, 15, 'static', false, '');
    const tree2 = new TopDownObj(110, 200, 15, 15, 'static', false, '')
  }
  
  if (!canvasAnimating) {
    canvasAnimating = true;
    animate();
  }
  clear();
  newLine("Welcome to the Game!");
}



function normalize(vector) {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (magnitude > 0) {
    return {
      x: vector.x / magnitude,
      y: vector.y / magnitude
    };
  }
  return { x: 0, y: 0 };
}


function clearCanvas() {
 c.fillStyle = 'white';
 c.fillRect(0, 0, canvasWidth, canvasHeight);
}

function animate() {
  if (canvasAnimating) {
    clearCanvas();
    for (let i = 0; i < data.length; i++) {
      data[i].draw();
      data[i].update();
    }
    
    requestAnimationFrame(animate);
  }
}


game();