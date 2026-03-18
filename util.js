// global math
var {
    sin,cos,tan,sinh,cosh,tanh,asin,acos,atan,asinh,acosh,atanh,atan2,hypot,
    floor,ceil,fround,trunc,abs,sign,min,max,random,imul,clz32,
    log:ln,log2:lg,log10:log,log1p,exp,expm1,pow,sqrt,cbrt,
    E:euler,LN10:ln10,LN2:ln2,LOG10E:log10e,LOG2E:log2e,PI:pi,SQRT1_2:hroot,SQRT2:root2
    } = Math;

// just cuz
var csc = x => 1/sin(x),
    sec = x => 1/cos(x),
    cot = x => 1/tan(x),
    acsc = x => asin(1/x),
    asec = x => acos(1/x),
    acot = x => atan(1/x),
    csch = x => 1/sinh(x),
    sech = x => 1/cosh(x),
    coth = x => 1/tanh(x),
    acsch = x => asinh(1/x),
    asech = x => acosh(1/x),
    acoth = x => atanh(1/x);

var tau = 2*pi,
    pi2 = pi/2,
    pi3 = 3*pi2;

var inf = Infinity,
    nif = -Infinity;

//  round(number,precision)
//  fixFloat(number)
//    .1+.2 = 0.30000000000000004
//    fixFloat(.1+.2) = 0.3
//  clamp(floor,value)
//  clamp(floor,value,ceiling)
//  mod(numerator,denominator)
//  mask(bits)
//  getBit(number,bits)
//  setBit(number,bits,value)
//  toSigned(number,bits)
//  toUnsigned(number,bits) (alias to maskBits)
//  maskBits(number,bits)
//  flipBits(number,bits)
//  range(length)
//    range(4) = [0,1,2,3]
//  range(start,end)
//    range(1,4) = [1,2,3,4]
//  chunk(array,size)
//    chunk([1,2,3,4,5],2) = [[1,2],[3,4],[5]]
//  binToGray(number)
//  grayToBin(number,bits)
//  toBigInt(array) array = [32bitInt, 32bitInt, ..., NbitInt]
//  bigDec(array) => String "1290"
//  bigBin(array) => String "0b1010"
//  bigHex(array) => String "0x12EF"
//  bigSignDec(array) => String "-1290"

var round = (n,p=0) => Math.round(n*(10**p))/(10**p);

var round2 = (n,d) => fixFloat(round(n / d) * d);
var floor2 = (n,d) => fixFloat(floor(n / d) * d);
var ceil2 = (n,d) => fixFloat(ceil(n / d) * d);

var fixFloat = n => round(n,10);

var clamp = (a,b,c=Infinity) => max(a,min(b,c));

var mod = (n,d) => ((n % d) + d) % d;

var mask = b => b >= 32 ? 0xFFFFFFFF : (1 << b) - 1;

var getBit = (n,b) => (n >> b) & 1;

var setBit = (n,b,v) => v ? (n | (1 << b)) : (n & ~(1 << b));

var toSigned = (n,b) => getBit(n,b-1) ? -((~n + 1) & mask(b)) : n;

var toUnsigned = (n,b) => n & mask(b);

var maskBits = (n,b) => n & mask(b);

var flipBits = (n,b) => ~n & mask(b);

var range = (min,max) => [...Array(max ? max-min+1 : min).keys()].map(n => n + (max ? min : 0));

var chunk = (arr,size) => arr.reduce((a,_,i) => i%size==0 ? [...a,arr.slice(i,i+size)] : a,[]);

var compressBinary = array => {
  var res=[];
  for (var i=0; i<array.length; i+=32) {
    res.push(array.slice(i,i+32).reduce((a,v,i) => a|(v<<(31-i)),0));
  }
  return res;
}

var decompressBinary = data => {
  var res=[];
  for (var i=0; i<data.length; i++) {
    for (var j=31; j>=0; j--) {
      res.push((data[i]>>j)&1);
    }
  }
  return res;
}

function toBitArray(n, b) {
    var r = new Array(b);
    for (var i = 0; i < b; i++) r[i] = (n >> i) & 1;
    return r;
}

function fromBitArray(a) {
    var n = 0;
    for (var i = 0; i < a.length; i++) n |= a[i] << i;
    return n;
}

function flipBitArray(a) {
    return a.map(b => b === null ? null : 1 - b);
}

function isLowZ(a) {
    return a.every(b => b !== null);
}

function hiZArray(b) {
    return Array(b).fill(null);
}

var binToGray = n => n ^ (n >> 1);

var grayToBin = (n,b) => range(b).reduce((a,i) => a ^ (a >> (1 << i)), n);

var toBigInt = n => n.reduce((a,v) => (a << 32n) | BigInt(v), 0n);

var bigDec = n => toBigInt(n).toString();

var bigBin = (n,b) => '0b' + toBigInt(n).toString(2).padStart(b ?? n.length*32, '0');

var bigHex = (n,b) => '0x' + toBigInt(n).toString(16).padStart(ceil((b ?? n.length*32)/4), '0');

var bigSignDec = (n,b) => {
  var v = toBigInt(n);
  return v >> BigInt((b ?? n.length * 32) - 1) & 1n 
    ? '-' + ((~v + 1n) & ((1n << BigInt(b ?? n.length * 32)) - 1n)).toString(10) 
    : v.toString(10);
};

var clone;
if (typeof structuredClone === 'function') {
  clone = structuredClone;
} else {
  clone = obj => JSON.parse(JSON.stringify(obj));
}

var greek = {
  Sigma: '\u03A3',
  Delta: '\u0394',
  Pi: '\u03A0',
};

var char = {
  Alpha: '\u0391',
  Beta: '\u0392',
  Gamma: '\u0393',
  Delta: '\u0394',
  Epsilon: '\u0395',
  Zeta: '\u0396',
  Eta: '\u0397',
  Theta: '\u0398',
  Iota: '\u0399',
  Kappa: '\u039A',
  Lambda: '\u039B',
  Mu: '\u039C',
  Nu: '\u039D',
  Xi: '\u039E',
  Omicron: '\u039F',
  Pi: '\u03A0',
  Rho: '\u03A1',
  Sigma: '\u03A3',
  Tau: '\u03A4',
  Upsilon: '\u03A6',
  Phi: '\u03A7',
  Chi: '\u03A8',
  Psi: '\u03A9',
  Omega: '\u03B1',
  alpha: '\u03B2',
  beta: '\u03B3',
  gamma: '\u03B4',
  delta: '\u03B5',
  epsilon: '\u03B6',
  zeta: '\u03B7',
  eta: '\u03B8',
  theta: '\u03B9',
  iota: '\u03BA',
  kappa: '\u03BC',
  lambda: '\u03BD',
  mu: '\u03BE',
  nu: '\u03BF',
  xi: '\u03C0',
  omicron: '\u03C1',
  pi: '\u03C3',
  rho: '\u03C4',
  sigma: '\u03C5',
  tau: '\u03C6',
  upsilon: '\u03C7',
  phi: '\u03C8',
  chi: '\u03C9',
  neg: '\u2212',
  mul: '\u00D7',
  div: '\u00F7',
  pm: '\u00B1',
  mp: '\u2213',
  inf: '\u221E',
  inc: '\u2206',
  dec: '\u2207',
  prod: '\u220F',
  sum: '\u2211',
  sqrt: '\u221A',
  star: '\u2605',
};

var sub = n => n.toString().split('').map(d => ['\u2080', '\u2081', '\u2082', '\u2083', '\u2084', '\u2085', '\u2086', '\u2087', '\u2088', '\u2089'][+d]).join('');

var sup = n => n.toString().split('').map(d => ['\u2070', '\u00B9', '\u00B2', '\u00B3', '\u2074', '\u2075', '\u2076', '\u2077', '\u2078', '\u2079'][+d]).join('');

Array.prototype.unique = function() {
  return [...new Set(this)];
}

Array.prototype.shuffle = function() {
  this.forEach((_, i) => {
    let j = floor(random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  });
  return this;
};

Array.prototype.toShuffled = function() {
  return this.slice().shuffle()
};

Array.prototype.random = function() {
  return this[floor(random()*this.length)];
};

Array.prototype.remove = function(item) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === item) {
      this.splice(i, 1);
      return item;
    }
  }
};

Array.prototype.removeAll = function(item) {
  var ret = false;
  for (var i = 0; i < this.length; ) {
    if (this[i] === item) {
      this.splice(i, 1);
      ret = true;
    } else i++;
  }
  if (ret) return item;
};

if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    var res = [];
    for (var i = this.length-1; i >= 0; i--) {
      res.push(this[i]);
    }
    return res;
  }
}

var eqValueOrArray = (a,b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

class SetArray extends Array {
  constructor() {
    super(...arguments);
  }

  push(...elements) {
    return super.push(...elements.filter(element => !this.includes(element)));
  }
  unshift(...elements) {
    return super.unshift(...elements.filter(element => !this.includes(element)));
  }
  add(value) {
    this.push(value);
    return this;
  }
  clear() {
    this.splice(0,this.length);
  }
  delete(value) {
    var index = this.indexOf(value);
    if (index > -1) {
      this.splice(index,1);
      return true;
    }
    return false;
  }
  has(value) {
    return this.includes(value);
  }
}

// Stack.inspect(stack) expose internal array
// Stack.inspect() expose internal WeakMap

var Stack = (function() {
  var data = new WeakMap();

  class Stack {
    type = this.constructor.name;

    constructor() {
      data.set(this, []);
    }

    push(item) {
      data.get(this).push(item);
    }

    pop() {
      return data.get(this).pop();
    }

    peek() {
      return data.get(this).at(-1);
    }

    static inspect(instance) {
      return instance ? data.get(instance) : data;
    }
  }

  return Stack;
})();
