var mathjs = require('mathjs');
var cos = mathjs.cos;
var sin = mathjs.sin;
var PI = Math.PI;
var SQRT1_2 = Math.SQRT1_2;


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

module.exports.fft = function(input) { return fftIterative(input, false);}
module.exports.ifft = function(input) { return fftIterative(input, true);}
