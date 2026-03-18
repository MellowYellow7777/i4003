var singleStep, nextBatch = new SetArray, currentBatch, updateQueue, tick, messageAlpha = 0;

function reset(stepThrough=false) {
  singleStep = false;
  tick = 0;
  nextBatch.clear();
  updateQueue = [];
  currentBatch = new Set(nextBatch);
  nodes.forEach(node => node.init());
  components.filter(c => c.type === 'input').forEach(inp => inp.state = inp === vss ? 1 : 0);
  components.filter(c => ['resistor','input'].includes(c.type)).forEach(c => nextBatch.add(c));
  singleStep = stepThrough;
  if (!singleStep) stabilize(true);
}

function step(r=false) {
  currentBatch = new Set(r ? nextBatch.toShuffled() : nextBatch);
  nextBatch.clear();
  if (r) {
    currentBatch.forEach(c => {
      updateQueue = [];
      c.update();
      updateQueue.forEach(q => q[0].update(q[1],q[2]));
    });
  } else {
    updateQueue = [];
    currentBatch.forEach(c => c.update());
    updateQueue.forEach(q => q[0].update(q[1],q[2]));
  }
}

function stabilize(init=false) {
  var o = 0;
  while (nextBatch.length > 0) {
    o++;
    if (o > 100) {
      messageAlpha = 1;
      draw();
      setTimeout(() => {
        var interval = setInterval(() => {
          messageAlpha -= .05;
          if (messageAlpha <= 0) {
            messageAlpha = 0;
            clearInterval(interval);
          }
          draw();
        }, 50);
      }, 2000);
      return reset();
    }
    step(init);
  }
}
