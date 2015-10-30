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
