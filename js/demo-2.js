/** @module demo-2 */require( 'demo-2', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
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
      var xd, yd;

      // #(getImageData)
      var img = ctx.getImageData(0, 0, W, H);
      var data = img.data;
      // #(getImageData)
      ctx.fillStyle = '#0f0';

      function paint() {
        if( nbFrames > 0 ) requestAnimationFrame( paint );
        else done();
        // #(loop)
        for( var i=0 ; i<dotsPerFrame ; i++ ) {
          p = Math.random();
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
          // `(xd|xd)` is equivalent to `Math.floor(xd)`, but faster.
          // `<< 2` is a fast multipication by 4.
          // Remember that there are 4 elements per pixel.
          // We add 1 to get the green channel.
          data[ 1 + (((xd|xd) + W * (yd|yd)) << 2) ] = 255;
          x = xx;
          y = yy;
        }
        // Putting back the array in the canvas.
        ctx.putImageData( img, 0, 0 );
        // #(loop)
        nbFrames--;
      }
      requestAnimationFrame( paint );
  }, opts);
};


  
module.exports._ = _;
/**
 * @module demo-2
 * @see module:$
 * @see module:demo

 */
});