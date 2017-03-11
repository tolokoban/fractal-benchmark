"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");

/**
 * @class Rnd
 *
 * Linear congruential method.
 * Xn+1 = (a * Xn + c) % m
 * X0 is the seed.
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
    DB.propInteger( this, 's' )(refresh);
    DB.propInteger( this, 'seed' )(refresh);

    opts = DB.extend({
         visible: true,
         a: 4321,
         c: 1,
         s: 0,
         seed: 458518 & 0xFFFF
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

  var a = this.a, c = this.c, s = this.s,
    seed = this.seed & 0xFFFFFFFF;
  var nbFrames = 1 << 14;
  var coverage = new Uint8Array(256);

  var paint = function() {
    var loops = 1 << 12;
    while( loops --> 0 ) {
      seed = ((seed * a + c) & 0xFFFFFFFF);
      x = (seed >> s) & 0xFF;
      coverage[x] = 1;
      seed = ((seed * a + c) & 0xFFFFFFFF);
      y = (seed >> s) & 0xFF;
      data[ 1 + ((x + W * y) << 2) ] += 1;
      coverage[y] = 1;
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
  title.textContent = "LG (" +
    this.a + "," + this.c + "," + this.s + ")";
}

module.exports = Rnd;
