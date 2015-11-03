var _ = require('underscore');
var math = require('mathjs');
var fft = require('./fft.js');

module.exports = {
  extend:_.extend,
  sqrt:math.sqrt,
  abs:math.abs,
  sin:math.sin,
  cos:math.cos,
  tan:math.tan,
  atan:math.atan,
  acos:math.acos,
  asin:math.asin,
  atan2:math.atan,
  log:math.log,
  fft:fft.fft,
  ifft:fft.ifft,
  complex:math.complex,

  mul: _multiparamOp(math.multiply),
  div: _multiparamOp(math.divide),
  sub: _multiparamOp(math.subtract),
  add:_multiparamOp(math.add),
  exp:math.exp,
  mod:math.mod,

  re:function(f){
    return function(t,opts){
      var v = f(t,opts);
      return v?v.re:null;
    }
  },
  absf:function(f){
    return function(t,opts){
      var v = f(t,opts);
      return math.abs(v);
    }
  },
  im:function(f){
    return function(t,opts){
      var v = f(t,opts);
      return v?v.im:null;
    }
  },
  arrShift:function(arr, on){
    on = on === undefined?  0.5: on;
    return function(i, opts){
      var size = opts.end - opts.start;
      var i = math.mod(i + size * on, size);
      return arr(i, opts);
      // console.log(i, opts);
    }
  },
  array(state){
    return function(a, starts, ends){
      return function(i, opts){
        if(!(i >= starts && i <= ends)) return 0;
        var normalizedIx = (i - starts) / (ends - starts);
        var tx = Math.floor(normalizedIx * (a.length)); 
        if(tx<0 || tx >= a.length) return 0;
        return a[tx];
      }
    }
  },
  get:function (ctx, path){
    path = path.split('.');
    var o = ctx;
    for(var i = 0; i < path.length; i++){
      if(o[path[i]] == undefined) return undefined;
      o = o[path[i]];
    }
    return o;
  },
  set: function(ctx, path, v){
    path = path.split('.');
    var o = ctx;
    for(var i =0; i< path.length-1; i++){
      if(!o[path[i]] && (i-1) != path.length) o[path[i]] = {};
      o = o[path[i]];
    }
    o[path[path.length-1]] = v;
  },
  asyncQueue: AsyncQueueOnWay
}

function AsyncQueueOnWay(opts){
  opts = opts || {};

  var fnlist = [];
  var isProcessing = false;
  return {
    add: function(f){
      fnlist.push(f);
      next();
    }
  }
  function next(){
    if(isProcessing) return;
    if(!fnlist.length) return;
    isProcessing = true;

    var f;
    if (opts.takeLast ){
      f = fnlist.pop();
      if(!opts.saveQueue)
        fnlist = [];
      f(finished(next));
    }
  }
  function finished(fn){
    return function(){
      isProcessing = false;
      fn();
    }
  }
}
function _multiparamOp(f){
  return function(){
    var acc = arguments[0];

    for(var i =1; i< arguments.length; i++){
      acc = f(acc, arguments[i]);
    }
    return acc;
  }
};
