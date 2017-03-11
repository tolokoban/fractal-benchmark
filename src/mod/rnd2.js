"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");

/**
 * @class Rnd
 *
 * Mitchell and Moore method. (TAOCP 2, page 27)
 * Xn+1 = (Xn-24 + Xn-55) % m
 * The seed is an array of the first 55 values.
 *
 * @param {boolean} opts.visible - Set the visiblity of the component.
 */
var Rnd = function(opts) {
    var canvas = $.tag("canvas", {width: 256, height: 256});
    var title = $.tag('center');
    var coverage = $.tag('center');
    var elem = $.elem( this, 'div', 'rnd', [title, canvas, coverage] );

    var refresh = refreshTitle.bind(this, title);

    DB.propRemoveClass( this, 'visible', 'hide' );
    DB.propInteger( this, 'a' )(refresh);
    DB.propInteger( this, 'c' )(refresh);

    opts = DB.extend({
         visible: true,
         a: 24,
         c: 55
    }, opts, this);

    function displayCoverage( sum ) {
      var p = Math.floor( 100 * sum / 256 );
      coverage.textContent = "Coverage: " + p + "%";
    }
    window.setTimeout(render.bind(this, canvas, displayCoverage), 1000);
};

function render( canvas, displayCoverage ) {
  var W = canvas.width;
  var H = canvas.height;
  var ctx = canvas.getContext('2d');
  var x = 0, y = 0;

  ctx.fillStyle = "#000";
  ctx.fillRect( 0, 0, W, H );
  var img = ctx.getImageData(0, 0, W, H);
  var data = img.data;

  var a = this.a, c = this.c, seed;
  a = 64 - a;
  c = 64 - c;

  var values = new Uint32Array(64);
  for( var k=0; k<64; k++ ) {
    values[k] = ((k*k + 47813) * 7) & 0xFFFF;
  }
  var n = 0;

  var nbFrames = 1 << 8;
  var coverage = new Uint8Array(256);

  var paint = function() {
    var loops = 1 << 12;
    while( loops --> 0 ) {
      n = (n + 1) & 63;
      seed = (values[(a + n) & 63] + values[(c + n) & 63]) & 0xFFFF;
      values[n] = seed;
      x = seed & 0xFF;
      coverage[x] = 1;
      n = (n + 1) & 63;
      seed = (values[(a + n) & 63] + values[(c + n) & 63]) & 0xFFFF;
      values[n] = seed;
      y = seed & 0xFF;
      data[ 1 + ((x + W * y) << 2) ] += 4;
    }
    ctx.putImageData( img, 0, 0 );
    if( nbFrames --> 0 ) window.requestAnimationFrame( paint );
    var idx = coverage.length;
    var sum = 0;
    while( idx --> 0 ) {
      if( coverage[idx] ) sum++;
    }
    displayCoverage( sum );
  }
  window.requestAnimationFrame( paint );
}

function refreshTitle( title ) {
  title.textContent = "Mitchell & Moore (" + this.a + "," + this.c + ")";
}

module.exports = Rnd;
