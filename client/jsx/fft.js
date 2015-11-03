var mathjs = require('mathjs');
var cos = mathjs.cos;
var sin = mathjs.sin;
var PI = Math.PI;
var SQRT1_2 = Math.SQRT1_2;


function fftIterativeFunction(f, opts , isInverse) {
  var from = opts.from;
  var to = opts.to;
  var amount = mathjs.pow(2, opts.amount);
  if(from > to) return function(){
    console.warn("Incorrect range from:", from, "To", to);
    return NaN;
  }
  var step = (to-from)/amount;

  var
    n = amount,
    // Counters.
    i, j,
    output, output_r, output_i,
    // Complex multiplier and its delta.
    f_r, f_i, del_f_r, del_f_i, temp,
    // Temporary loop variables.
    l_index, r_index,
    left_r, left_i, right_r, right_i,
    calculated = false,
    // width of each sub-array for which we're iteratively calculating FFT.
    width

  output = [];
  for(var i = from; i < to; i+=step){
    output.push(f(i));
  }

  if(output.length % 2)
    output.push(mathjs.complex(0,0));

  // Loops go like O(n log n):
  //   width ~ log n; i,j ~ n
  width = 1;
  return function(i, opts){
    if(!calculated) generate();
    if(!(i >= from && i <= to)) return 0;
    var normalizedIx = (i - from) / (to - from);
    var tx = Math.floor(normalizedIx * (output.length)); 
    if(tx<0 || tx >= output.length) return 0;
    return output[tx];
  }

  function generate(){
    while (width < n) {
      del_f_r = cos(PI/width)
      del_f_i = (isInverse ? -1 : 1) * sin(PI/width)
      for (i = 0; i < n/(2*width); i++) {
        f_r = 1;
        f_i = 0;
        for (j = 0; j < width; j++) {
          l_index = 2*i*width + j
          r_index = l_index + width

          left_r = output[l_index].re;
          left_i = output[l_index].im;
          right_r = f_r * output[r_index].re - f_i * output[r_index].im;
          right_i = f_i * output[r_index].re + f_r * output[r_index].im;

          output[l_index].re = SQRT1_2 * (left_r + right_r)
          output[l_index].im = SQRT1_2 * (left_i + right_i)
          output[r_index].re = SQRT1_2 * (left_r - right_r)
          output[r_index].im = SQRT1_2 * (left_i - right_i)
          temp = f_r * del_f_r - f_i * del_f_i
          f_i = f_r * del_f_i + f_i * del_f_r
          f_r = temp
        }
      }
      width <<= 1
    }
    calculated = true;
  }
}

function fftIterative(input, isInverse) {
  var
    n = input.length,
    // Counters.
    i, j,
    output, output_r, output_i,
    // Complex multiplier and its delta.
    f_r, f_i, del_f_r, del_f_i, temp,
    // Temporary loop variables.
    l_index, r_index,
    left_r, left_i, right_r, right_i,
    // width of each sub-array for which we're iteratively calculating FFT.
    width

  //output = BitReverseComplexArray(input)
  //output_r = output.real
  //output_i = output.imag
  
  output = [];
  input.forEach(function(i){output.push(mathjs.complex(i.re, i.im)); });
  if(output.length % 2)
    output.push(mathjs.complex(0,0));

  // Loops go like O(n log n):
  //   width ~ log n; i,j ~ n
  width = 1
  while (width < n) {
    del_f_r = cos(PI/width)
    del_f_i = (isInverse ? -1 : 1) * sin(PI/width)
    for (i = 0; i < n/(2*width); i++) {
      f_r = 1;
      f_i = 0;
      for (j = 0; j < width; j++) {
        l_index = 2*i*width + j
        r_index = l_index + width

        left_r = output[l_index].re;
        left_i = output[l_index].im;
        right_r = f_r * output[r_index].re - f_i * output[r_index].im;
        right_i = f_i * output[r_index].re + f_r * output[r_index].im;

        output[l_index].re = SQRT1_2 * (left_r + right_r)
        output[l_index].im = SQRT1_2 * (left_i + right_i)
        output[r_index].re = SQRT1_2 * (left_r - right_r)
        output[r_index].im = SQRT1_2 * (left_i - right_i)
        temp = f_r * del_f_r - f_i * del_f_i
        f_i = f_r * del_f_i + f_i * del_f_r
        f_r = temp
      }
    }
    width <<= 1
  }
  return output;
}

function transformRadix2(input, isInverse) { //real, imag) {
    // Initialization
    // if (real.length != imag.length)
        // throw "Mismatched lengths";
    var n = input.length;
    if (n == 1)  // Trivial transform
        return;
    var levels = -1;
    for (var i = 0; i < 32; i++) {
        if (1 << i == n)
            levels = i;  // Equal to log2(n)
    }
    if (levels == -1)
        throw new Error("Length is not a power of 2");
    var cosTable = new Array(n / 2);
    var sinTable = new Array(n / 2);
    for (var i = 0; i < n / 2; i++) {
        cosTable[i] = Math.cos(2 * Math.PI * i / n);
        sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }
    var re = isInverse?'im':'re';
    var im = isInverse?'re':'im';
    // Bit-reversed addressing permutation
    for (var i = 0; i < n; i++) {
        var j = reverseBits(i, levels);
        if (j > i) {
          var temp = input[i];
          input[i] = input[j];
          input[j] = temp;
            //var temp = real[i];
            //real[i] = real[j];
            //real[j] = temp;
            //temp = imag[i];
            //imag[i] = imag[j];
            //imag[j] = temp;
        }
    }
    
    // Cooley-Tukey decimation-in-time radix-2 FFT
    return function(){
      for (var size = 2; size <= n; size *= 2) {
        var halfsize = size / 2;
        var tablestep = n / size;
        for (var i = 0; i < n; i += size) {
          for (var j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
            var tpre =  real(j+halfsize) * cosTable[k] + imag(j+halfsize) * sinTable[k];
            var tpim = -real(j+halfsize) * sinTable[k] + imag(j+halfsize) * cosTable[k];
            var o = complex( real(j) - tpre, imag(j) - tpim );
            input[j + halfsize] = o
            input[j][re] += tpre;
            input[j][im] += tpim;
          }
        }
      }
    }

    function complex(re, im){
      if(isInverse)
        return mathjs.complex(im, re);
      else
        return mathjs.complex(re, im);
    }
    function real(i){
      return input[i][re];
    }
    function imag(i){
      return input[i][im];
    }
    
    // Returns the integer whose value is the reverse of the lowest 'bits' bits of the integer 'x'.
    function reverseBits(x, bits) {
        var y = 0;
        for (var i = 0; i < bits; i++) {
            y = (y << 1) | (x & 1);
            x >>>= 1;
        }
        return y;
    }
}

function FFT(f, opts, isReverse, state){
  var from = opts.from;
  var to = opts.to;
  var amount = mathjs.pow(2, opts.amount);
  var shift = opts.shift || 0.0;
  var calculated = false;
  if(from > to) return function(){
    console.warn("Incorrect range from:", from, "To", to);
    return NaN;
  }
  var step = (to-from)/amount;

  var output = [];
  for(var i = from; i < to; i+=step){
    var v = f(i);
    if(typeof(v) == 'number') v = mathjs.complex(v,0);
    output.push(mathjs.complex(v.re, v.im));
    if(output.length == amount) break;
  }

  var generate = transformRadix2(output, isReverse);
  // Loops go like O(n log n):
  //   width ~ log n; i,j ~ n
  width = 1;
  return function(i, opts){
    opts = opts || {};
    if(!calculated || state.arraysInvalid) {
      generate();
      calculated = true;
    }
    if(!(i >= from && i <= to)) return 0;
    var normalizedIx = (i - from) / (to - from);
    normalizedIx = mathjs.mod(normalizedIx + shift, 1.0);
    var tx = Math.floor(normalizedIx * (output.length)); 
    if(tx<0 || tx >= output.length) return 0;
    return isReverse?mathjs.divide(output[tx], amount): output[tx];
  }
}

module.exports.fft = function(state){
  return function(input, opts) { 
    return FFT(input, opts, false, state);
  }
}

module.exports.ifft = function(state){
  return function(input, opts) { 
    return FFT(input, opts, true, state);
  }
}



