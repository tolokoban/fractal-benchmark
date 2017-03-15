"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");

var DUR = 1000;

/**
 * @class Anim
 *
 * @param {boolean} opts.visible - Set the visiblity of the component.
 *
 * @example
 * var Anim = require("Anim");
 * var instance = new Anim({ visible: false });
 */
var Anim = function(opts) {
    var that = this;
    var elem = $.elem( this, 'canvas', 'anim', { width: 256, height: 512 } );
    var ctx = elem.getContext( '2d' );
    var imageData = ctx.getImageData(0, 0, 256, 512);
    var computer = new Computer(window);
    var compute = computer.compute;
    var t0 = 0;
    var oldValue = {};
    var v0 = {};
    var v1 = {};

    DB.propRemoveClass( this, 'visible', 'hide' );

    function paint() {
      var v;
      if( t0 === 0 ) {
        v = v1;
      } else {
        var t1 = performance.now();
        var t = (t1 - t0) / DUR;
        if( t > 1 ) {
          v = v1;
        } else {
          var w = 1 - t;
          v = {
            pa: w*v0.pa + t*v1.pa,
            vxa: w*v0.vxa + t*v1.vxa,
            vya: w*v0.vya + t*v1.vya,
            m11a: w*v0.m11a + t*v1.m11a,
            m12a: w*v0.m12a + t*v1.m12a,
            m21a: w*v0.m21a + t*v1.m21a,
            m22a: w*v0.m22a + t*v1.m22a,
            pb: w*v0.pb + t*v1.pb,
            vxb: w*v0.vxb + t*v1.vxb,
            vyb: w*v0.vyb + t*v1.vyb,
            m11b: w*v0.m11b + t*v1.m11b,
            m12b: w*v0.m12b + t*v1.m12b,
            m21b: w*v0.m21b + t*v1.m21b,
            m22b: w*v0.m22b + t*v1.m22b,
            pc: w*v0.pc + t*v1.pc,
            vxc: w*v0.vxc + t*v1.vxc,
            vyc: w*v0.vyc + t*v1.vyc,
            m11c: w*v0.m11c + t*v1.m11c,
            m12c: w*v0.m12c + t*v1.m12c,
            m21c: w*v0.m21c + t*v1.m21c,
            m22c: w*v0.m22c + t*v1.m22c,
            pd: w*v0.pd + t*v1.pd,
            vxd: w*v0.vxd + t*v1.vxd,
            vyd: w*v0.vyd + t*v1.vyd,
            m11d: w*v0.m11d + t*v1.m11d,
            m12d: w*v0.m12d + t*v1.m12d,
            m21d: w*v0.m21d + t*v1.m21d,
            m22d: w*v0.m22d + t*v1.m22d
          };
        }
      }

      var pa = v.pa;
      var pb = v.pb;
      var pc = v.pc;
      var pd = v.pd;
      var p = pa + pb + pc + pd;
      if( p < 1 ) return;
      pa = 1024 * pa / p;
      pb = 1024 * pb / p;
      pc = 1024 * pc / p;
      pd = 1024 * pd / p;
      pb += pa;
      pc += pb;
      pd += pc;

      compute(
        imageData.data, 1000000, 256, 512, 140, 512, -51,
        pa|0, v.vxa, v.vya, v.m11a, v.m12a, v.m21a, v.m22a,
        pb|0, v.vxb, v.vyb, v.m11b, v.m12b, v.m21b, v.m22b,
        pc|0, v.vxc, v.vyc, v.m11c, v.m12c, v.m21c, v.m22c,
        pd|0, v.vxd, v.vyd, v.m11d, v.m12d, v.m21d, v.m22d
      );

      ctx.putImageData( imageData, 0, 0 );
      window.requestAnimationFrame( paint );
    };

    DB.prop( this, 'value' )(function(v) {
      t0 = performance.now();
      v0 = oldValue;
      v1 = copy(v);
      oldValue = v1;
    });

    opts = DB.extend({
       visible: true,
       value: {
         pa: 850, m11a:  0.85, m12a:  0.04, m21a: -0.04, m22a: 0.85, vxa: 0, vya: 1.6,
         pb:  10, m11b:  0.0,  m12b:  0.0 , m21b:  0.0 , m22b: 0.16, vxb: 0, vyb: 0.0,
         pc:  70, m11c:  0.2 , m12c: -0.26, m21c:  0.23, m22c: 0.22, vxc: 0, vyc: 1.6,
         pd:  70, m11d: -0.15, m12d:  0.28, m21d:  0.26, m22d: 0.24, vxd: 0, vyd: 0.44
       }
    }, opts, this);

    window.requestAnimationFrame( paint );
};


module.exports = Anim;




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
    var p = 0|0;

    pa = pa|0;
    pb = pb|0;
    pc = pc|0;
    pd = pd|0;
    vxa = +vxa; vya = +vya; m11a = +m11a; m12a = +m12a; m21a = +m21a; m22a = +m22a;
    vxb = +vxb; vyb = +vyb; m11b = +m11b; m12b = +m12b; m21b = +m21b; m22b = +m22b;
    vxc = +vxc; vyc = +vyc; m11c = +m11c; m12c = +m12c; m21c = +m21c; m22c = +m22c;
    vxd = +vxd; vyd = +vyd; m11d = +m11d; m12d = +m12d; m21d = +m21d; m22d = +m22d;

    var idx = 0|0;
    var count = (W * H)|0;
    while( count > 0|0 ) {
      data[idx] = 0;   idx = (idx + 1)|0;
      data[idx] = 0;   idx = (idx + 1)|0;
      data[idx] = 0;   idx = (idx + 1)|0;
      data[idx] = 255; idx = (idx + 1)|0;
      count = (count - 1)|0;
    }

    while( dots > 0 ) {
      dots = dots - 1|0;
      // Mitchell & Moore algorithm.
      n = ((n + 1) & 63)|0;
      rnd = (values[(a + n) & 63] + values[(c + n) & 63]) & 0xFFFF;
      values[n] = rnd;
      p = rnd & 1023;
      if( p < pa ) {
        xx = +(x * m11a + y * m12a + vxa);
        yy = +(x * m21a + y * m22a + vya);
      }
      else if( p < pb ) {
        xx = +(x * m11b + y * m12b + vxb);
        yy = +(x * m21b + y * m22b + vyb);
      }
      else if( p < pc ) {
        xx = +(x * m11c + y * m12c + vxc);
        yy = +(x * m21c + y * m22c + vyc);
      }
      else {
        xx = +(x * m11d + y * m12d + vxd);
        yy = +(x * m21d + y * m22d + vyd);
      }
      xd = (xx*Z + CX)|0;
      yd = (yy*Z + CY)|0;
      data[ (1 + ((xd + (yd << 8)) << 2))|0 ] += 3;
      x = +xx;
      y = +yy;
    }
  }

  return { compute: compute };
}


function copy(v) {
  return {
    pa: v.pa, vxa: v.vxa, vya: v.vya, m11a: v.m11a, m12a: v.m12a, m21a: v.m21a, m22a: v.m22a,
    pb: v.pb, vxb: v.vxb, vyb: v.vyb, m11b: v.m11b, m12b: v.m12b, m21b: v.m21b, m22b: v.m22b,
    pc: v.pc, vxc: v.vxc, vyc: v.vyc, m11c: v.m11c, m12c: v.m12c, m21c: v.m21c, m22c: v.m22c,
    pd: v.pd, vxd: v.vxd, vyd: v.vyd, m11d: v.m11d, m12d: v.m12d, m21d: v.m21d, m22d: v.m22d
  };
}
