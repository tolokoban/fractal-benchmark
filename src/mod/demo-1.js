"use strict";

var DemoKernel = require("demo");

module.exports = function(opts) {
  if( typeof opts === '' ) opts = {};

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

      ctx.fillStyle = '#0f0';

      function paint() {
        if( nbFrames > 0 ) requestAnimationFrame( paint );
        else done();

        // #(loop)
        for( var i=0 ; i<dotsPerFrame ; i++ ) {
          // Select a transformation depending on a random probability.
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
          // Scale and center for the screen.
          xd = xx*Z + CX;
          yd = yy*Z + CY;
          // Use standard Context2D function `fillRect`.
          ctx.fillRect( xd, yd, 1, 1 );
          // Next point become current one.
          x = xx;
          y = yy;
        }
        // #(loop)
        nbFrames--;
      }
      requestAnimationFrame( paint );
  }, opts);
};
