"use strict";

var DemoKernel = require("demo");

/*
// Promise for WASM fetching and compiling.
var loadWasm = new Promise(function (resolve, reject) {
  fetch("test.wasm").then(function(response) {
    return response.arrayBuffer();
  }).then(function(bytes) {
    return WebAssembly.instantiate(bytes, {})
  }).then(function(results) {
    for( key in results.instance.exports ) {
      val = results.instance.exports[key];
      console.info("key, val=", key, val)
    }
    resolve( val );
  })
});
*/

module.exports = function(opts) {
 DemoKernel( this, function(
     done, canvas, dotsPerFrame, nbFrames,
     W, H, CX, CY, Z,
     pa, vxa, vya, m11a, m12a, m21a, m22a,
     pb, vxb, vyb, m11b, m12b, m21b, m22b,
     pc, vxc, vyc, m11c, m12c, m21c, m22c,
     pd, vxd, vyd, m11d, m12d, m21d, m22d
 ) {
     var ctx = canvas.getContext('2d');
     var x = 0, y = 0;
     var xd, yd, p, xx, yy;

     var img = ctx.getImageData(0, 0, W, H);
     var data = img.data;
     ctx.fillStyle = '#0f0';

     pa = (pa * 1023)|0;
     pb = (pb * 1023)|0;
     pc = (pc * 1023)|0;
     pd = (pd * 1023)|0;

     var computer = new Computer(window);
     var compute = computer.compute;

     function paint() {
       if( nbFrames > 0 ) window.requestAnimationFrame( paint );
       else done();

       compute(
         img.data, dotsPerFrame,
         W, H, CX, CY, Z,
         pa, vxa, vya, m11a, m12a, m21a, m22a,
         pb, vxb, vyb, m11b, m12b, m21b, m22b,
         pc, vxc, vyc, m11c, m12c, m21c, m22c,
         pd, vxd, vyd, m11d, m12d, m21d, m22d
       );

       ctx.putImageData( img, 0, 0 );
       nbFrames--;
     }
     window.requestAnimationFrame( paint );
 }, opts);
};


function Computer(global) {
  "use asm";
  var values = new Uint32Array(64);
  for( var k=0; k<55; k++ ) {
    values[k] = ((k*k + 47813) * 7) & 0xFFFF;
  }

  function compute(data, dots,
                   W, H, CX, CY, Z,
                   pa, vxa, vya, m11a, m12a, m21a, m22a,
                   pb, vxb, vyb, m11b, m12b, m21b, m22b,
                   pc, vxc, vyc, m11c, m12c, m21c, m22c,
                   pd, vxd, vyd, m11d, m12d, m21d, m22d) {
    dots = dots|0;
    var rnd = 0|0;
    var n = 55|0, a = (64 - 24)|0, c = (64 - 55)|0;
    var x = 0|0, y = 0|0, xx = 0|0, yy = 0|0, xd = 0|0, yd = 0|0;
    while( dots > 0 ) {
      dots = dots - 1|0;
      // Mitchell & Moore algorithm.
      n = (n + 1) & 63;
      rnd = (values[(a + n) & 63] + values[(c + n) & 63]) & 0xFFFF;
      values[n] = rnd;
      p = rnd & 1023;
      if( p < pa ) {
        xx = x * m11a + y * m12a + vxa;
        yy = x * m21a + y * m22a + vya;
      }
      else if( p < pb ) {
        xx = x * m11b + y * m12b + vxb;
        yy = x * m21b + y * m22b + vyb;
      }
      else if( p < pc ) {
        xx = x * m11c + y * m12c + vxc;
        yy = x * m21c + y * m22c + vyc;
      }
      else {
        xx = x * m11d + y * m12d + vxd;
        yy = x * m21d + y * m22d + vyd;
      }
      xd = xx*Z + CX;
      yd = yy*Z + CY;
      data[ 1 + (((xd|xd) + W * (yd|yd)) << 2) ]++;
      x = xx;
      y = yy;
    }
  }

  return { compute: compute };
}
