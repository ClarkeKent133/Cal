function canvas() {
  outputField.innerHTML = "<canvas id='canvas' width='580px' height='250px'></canvas>";
  /** @type {HTMLCanvasElement} */
  const canvas = document.querySelector("#canvas");
  const c = canvas.getContext('2d');
  c.fillStyle = 'red';
  c.fillRect(0, 0, 580, 250);
}

canvas();