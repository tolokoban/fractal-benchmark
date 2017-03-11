/** @module demo-5 */require( 'demo-5', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var DemoKernel = require("demo");

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

      var values = new Uint32Array(64);
      for( var k=0; k<64; k++ ) {
        values[k] = ((k*k + 47813) * 7) & 0xFFFF;
      }
      var rnd;
      var n = 0;
      var a = 64 - 24;
      var c = 64 - 55;

      function paint() {
        if( nbFrames > 0 ) window.requestAnimationFrame( paint );
        else done();

        for( var i=0 ; i<dotsPerFrame ; i++ ) {
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
        ctx.putImageData( img, 0, 0 );
        nbFrames--;
      }
      window.requestAnimationFrame( paint );
  }, opts);
};


  
module.exports._ = _;
/**
 * @module demo-5
 * @see module:$
 * @see module:demo

 */
});