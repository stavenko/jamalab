var mathjs = require('mathjs');
var cos = mathjs.cos;
var sin = mathjs.sin;
var PI = Math.PI;
var SQRT1_2 = Math.SQRT1_2;


function fftIterativeFunction(f, opts , isInverse) {
  console.log("FFT");
  var from = opts.from;
  var to = opts.to;
  var amount = mathjs.pow(2, opts.amount);
  if(from > to) return function(){
    console.warn("Incorrect range from:", from, "To", to);
    return NaN;
  }
  var step = (to-from)/amount;
  console.log(step);

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
    // console.log("arr", i, normalizedIx);
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
  
  output = []
  input.forEach(function(i){output.push(i)});
  if(output.length % 2)
    output.push({re:0, im:0});

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

module.exports.fft = function(input, opts) { return fftIterativeFunction(input, opts, false);}
module.exports.ifft = function(input, opts) { return fftIterativeFunction(input, opts, true);}


function f(t){
  return { re: mathjs.sin(t), im:0, isComplex:true };

}
var arr = [];
var from =0;
var to = 4*Math.PI;
var amount = 64;
var step = (to-from)/amount; 
for(var i = 0; i < amount; i++){
  var a = i*step;
  arr.push(f(a));
}
console.log(arr,"\n\n\n", fftIterative(arr, false));


