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

  mul: function(){
    var acc = arguments[0];
    for(var i =1; i< arguments.length; i++){
      // console.log('M', acc, arguments[i]);
      acc = math.multiply(acc, arguments[i]);
    }
    return acc;
  },

  add:math.add,
  exp:math.exp,

  array(a, starts, ends){
    return function(i, opts){
      if(!(i >= starts && i <= ends)) return 0;
      var normalizedIx = (i - starts) / (ends - starts);
      var tx = Math.floor(normalizedIx * (a.length)); 
      console.log("arr", i, normalizedIx);
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
