/** @module demo-4 */require( 'demo-4', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
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

      var img = ctx.getImageData(0, 0, W, H);
      var data = img.data;
      ctx.fillStyle = '#0f0';

      var rr = 0, gg = 0, bb = 0;

      function paint() {
        if( nbFrames > 0 ) requestAnimationFrame( paint );
        else done();

        for( var i=0 ; i<dotsPerFrame ; i++ ) {
          p = Math.random();
          if( p < pa ) {
            rr = bb = 0;
            gg = 1;
            xx = x * m11a + y * m12a + vxa;
            yy = x * m21a + y * m22a + vya;
          }
          else if( p < pb ) {
            rr = 1;
            gg = bb = 0;
            xx = x * m11b + y * m12b + vxb;
            yy = x * m21b + y * m22b + vyb;
          }
          else if( p < pc ) {
            rr = gg = bb = 1;
            xx = x * m11c + y * m12c + vxc;
            yy = x * m21c + y * m22c + vyc;
          }
          else {
            bb = 1;
            rr = gg = 0;
            xx = x * m11d + y * m12d + vxd;
            yy = x * m21d + y * m22d + vyd;
          }
          xd = xx*Z + CX;
          yd = yy*Z + CY;
          data[ 0 + (((xd|xd) + W * (yd|yd)) << 2) ] += rr;
          data[ 1 + (((xd|xd) + W * (yd|yd)) << 2) ] += gg;
          data[ 2 + (((xd|xd) + W * (yd|yd)) << 2) ] += bb;
          x = xx;
          y = yy;
        }
        ctx.putImageData( img, 0, 0 );
        nbFrames--;
      }
      requestAnimationFrame( paint );
  }, opts);
};


  
module.exports._ = _;
/**
 * @module demo-4
 * @see module:$
 * @see module:demo

 */
});