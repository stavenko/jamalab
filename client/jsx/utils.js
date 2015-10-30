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
  exp:math.exp,
  log:math.log,
  fft:fft.fft,
  ifft:fft.ifft,

  array:function(f, from, to, step){
    from = from || 0;
    to   = to || 100;
    step = step || 1;
    var arr = [];
    for(var i = from; i <= to; i+=step)
      arr.push(f(i));
    arr.limits={
      from:from,
      to:to,
      step:step
    }
    return arr;
  },

  arrayGetter(a, starts, ends){
    return function(i){
      var normalizedIx = (i-starts) / (ends-starts);
      var tx = Math.floor(normalizedIx * (a.length)) + starts;
      if(tx<0 || tx >= a.length) return 0;
      return a[tx];
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
  }
}
