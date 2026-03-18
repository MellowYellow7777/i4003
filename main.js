var canvas, ctx, simg, mode, mouseX, mouseY, lastX, lastY, world, dragging, showKey;

window.onload = function() {
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);
  inputs = components.filter(c => c.type === 'input');

  mouseX = mouseY = lastX = lastY = 0;
  world = { x: 0, y: 0, scale: 1 };
  dragging = false;

  simg = new Image();
  simg.src = './i4003.gif';

  showKey = true;

  mode = 'sim';

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

window.onresize = resize;

resize();

canvas.onpointerdown = function(event) {
  var x = (event.offsetX - world.x) / world.scale;
  var y = (event.offsetY - world.y) / world.scale;
  var inp = false;
  if (mode === 'sim') {
    inp = inputs.find(inp => inp.rects.some(rect => 
      rect[0][0] <= x && x <= rect[1][0] &&
      rect[0][1] <= y && y <= rect[1][1]
    ));
  }
  if (inp) {
    inp.toggle();
  } else {
    this.setPointerCapture(event.pointerId);
    dragging = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
  }
  event.preventDefault();
}

canvas.onpointermove = function(event) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
    if (dragging) {
        world.x += event.offsetX - lastX;
        world.y += event.offsetY - lastY;
        lastX = event.offsetX;
        lastY = event.offsetY;
        draw();
    }
};

canvas.onpointerup = function(event) {
    this.releasePointerCapture(event.pointerId);
    dragging = false;
};
/*
canvas.onwheel = function(event) {
    var scaleAmount = 1.1;
    var mouseX = (event.offsetX - world.x) / world.scale;
    var mouseY = (event.offsetY - world.y) / world.scale;
    if (event.deltaY > 0) scaleAmount = 1 / scaleAmount;
    world.scale *= scaleAmount;
    world.x = event.offsetX - mouseX * world.scale;
    world.y = event.offsetY - mouseY * world.scale;
    draw();
    event.preventDefault();
};
*/
window.onkeydown = function(event) {
  switch (event.code) {
    case 'ArrowUp':
      var mouseSX = (mouseX - world.x) / world.scale;
      var mouseSY = (mouseY - world.y) / world.scale;
      if (world.scale < 1) {world.scale *= 1.5} else {world.scale++}
      world.x = mouseX - mouseSX * world.scale;
      world.y = mouseY - mouseSY * world.scale;
      draw();
      break;
    case 'ArrowDown':
      var mouseSX = (mouseX - world.x) / world.scale;
      var mouseSY = (mouseY - world.y) / world.scale;
      if (world.scale <= 1) {world.scale /= 1.5} else {world.scale--}
      world.x = mouseX - mouseSX * world.scale;
      world.y = mouseY - mouseSY * world.scale;
      draw();
      break;
    case 'KeyS':
      mode = mode === 'sim' ? 'schematic' : 'sim';
      draw();
      break;
    case 'KeyH':
      showKey = !showKey;
      draw();
      break;
    case 'KeyC':
      clk.toggle();
      break;
    case 'KeyD':
      data.toggle();
      break;
    case 'KeyE':
      en.toggle();
      break;
  }
  event.preventDefault();
}

  ctx.imageSmoothingEnabled = false;
  canvas.style = `
    position: absolute;
    left: 0px;
    top: 0px;
  `;
  init();
}

function init() {
  reset();
  draw();
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.translate(round(world.x), round(world.y));
  ctx.scale(world.scale, world.scale);
  if (mode === 'schematic') {
    ctx.drawImage(simg,0,0);
  } else if (mode === 'sim') {
    nodes.forEach(n => n.draw(ctx));
    components.forEach(c => c.draw(ctx));
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText('VDD',11,49);
    ctx.fillText('VSS',11,85);
    ctx.fillText('CLK',11,163);
    ctx.fillText('DATA',11,431);
    ctx.fillText('EN',11,536);
    ctx.fillText('OUT',11,660);
    ctx.fillText('Q0',515,56);
    ctx.fillText('Q1',645,56);
    ctx.fillText('Q2',775,56);
    ctx.fillText('Q3',905,56);
    ctx.fillText('Q4',1035,56);
    ctx.fillText('Q5',515,436);
    ctx.fillText('Q6',645,436);
    ctx.fillText('Q7',775,436);
    ctx.fillText('Q8',905,436);
    ctx.fillText('Q9',1035,436);
  }
  ctx.restore();
  if (messageAlpha) {
    ctx.font='12px sans-serif';
    ctx.fillStyle = 'white';
    ctx.globalAlpha = messageAlpha;
    ctx.fillText('simulation reset (oscillation/short circuit)',0,10);
    ctx.globalAlpha = 1;
  }
  if (!showKey) return;
  var yy=canvas.height-150;
  ctx.font='12px sans-serif';
  ctx.fillStyle='white';
  var t='Active Low Signal:';
  ctx.fillText(t,10,yy);
  var w=ctx.measureText(t).width;
  ctx.fillStyle='#66FF66';
  t=' strong';
  ctx.fillText(t,10+w,yy);
  w+=ctx.measureText(t).width;
  ctx.font='bold 12px sans-serif';
  ctx.fillStyle='#338833';
  t=' weak';
  ctx.fillText(t,10+w,yy);
  yy+=20;
  ctx.font='12px sans-serif';
  ctx.fillStyle='white';
  t='Inactive High Signal:';
  ctx.fillText(t,10,yy);
  w=ctx.measureText(t).width;
  ctx.fillStyle='#6600FF';
  t=' strong';
  ctx.fillText(t,10+w,yy);
  w+=ctx.measureText(t).width;
  ctx.font='bold 12px sans-serif';
  ctx.fillStyle='#330088';
  t=' weak';
  ctx.fillText(t,10+w,yy);
  yy+=20;
  ctx.font='12px sans-serif';
  ctx.fillStyle='white';
  ctx.fillText('click (on input): toggle on/off',10,yy);
  yy+=20;
  ctx.fillText('click+drag: pan camera',10,yy);
  yy+=20;
  ctx.fillText('up/down arrows: zoom in/out',10,yy);
  yy+=20;
  ctx.fillText('S: show/hide schematic',10,yy);
  yy+=20;
  ctx.fillText('H: show/hide this text',10,yy);
  yy+=20;
  ctx.fillText('C, D, E: toggle CLK, DATA, EN inputs',10,yy);
}
