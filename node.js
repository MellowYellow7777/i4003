class Node {
  constructor(rects) {
    this.rects = rects ?? [];
    this.pins = [];
    this.state = 0;
    this.isDriven = false;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    this.rects.forEach(r => {
      ctx.fillRect(r[0][0],r[0][1],r[1][0]-r[0][0]+1,r[1][1]-r[0][1]+1);
    })
  }

  get color() {
    return this.state === null ? this.lastState === null ? '#808080' : this.lastState ? '#330088' : '#338833' : this.state ? '#6600FF' : '#66FF66';
  }

  init() {
    this.state = null;
    this.pins.forEach(pin => pin.state = null);
    this.drivers = this.pins.filter(pin => pin.type === 'output');
    this.switchMap = this.pins
      .filter(pin => pin.component.type === 'transistor')
      .filter(pin => pin !== pin.component.pins[1])
      .map(pin => {
      var o = {};
      o.switch = pin.component;
      o.pin = pin;
      return o;
    });
  }

  reset() {
    this.state = null;
    this.lastState = null;
    this.pins.forEach(pin => pin.state = null);
    this.isDriven = false;
  }

  update(from) {
    var nodes = [this];
    function bridgeGaps(node) {
      node.switchMap.forEach(s => {
        var pinb = s.switch.getOtherPin(s.pin);
        if (!pinb) return;
        if (nodes.includes(pinb.node)) return;
        nodes.push(pinb.node);
        bridgeGaps(pinb.node);
      });
    }
    bridgeGaps(this);

    var pins = nodes.map(node => node.pins).flat();
    var active = pins.filter(pin => pin.driving);

    var state;
    this.isDriven = active.length > 0;
    if (this.isDriven) {
      state = active[0].state;
    } else {
      var resistor = pins.find(pin => pin.component.type === 'resistor');
      state = resistor ? vdd.state : null;
    }

    nodes.forEach(node => {
      node.state = state;
      if (state !== null) node.lastState = state;
    });

    pins.filter(pin => ['input','dual'].includes(pin.type)).forEach(pin => {
      if (pin.state !== state && !pin.driving) {
        pin.state = state;
        if (pin.component.type === 'output') {
          pin.component.update();
        } else if (pin !== from) {
          nextBatch.add(pin.component);
        }
      }
    });
  }
}
