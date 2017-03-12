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
    var title = $.tag('center', ["Math.random()"]);
    var coverage = $.tag('center');
    var elem = $.elem( this, 'div', 'rnd', [title, canvas, coverage] );

    DB.propRemoveClass( this, 'visible', 'hide' );

    opts = DB.extend({
         visible: true
    }, opts, this);

    function displayCoverage( sum, holes ) {
      var p = Math.floor( 100 * sum / 256 );
      coverage.textContent = "Coverage: " + p + "%";
      coverage.setAttribute(
          "title",
          holes.length == 0 ? '' : JSON.stringify( holes )
      );
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

  var nbFrames = 1 << 8;
  var coverage = new Uint8Array(256);

  var paint = function() {
    var loops = 1 << 12;
    while( loops --> 0 ) {
      x = (Math.random() * 256)|0;
      coverage[x] = 1;
      y = (Math.random() * 256)|0;
      coverage[y] = 1;
      data[ 1 + ((x + W * y) << 2) ] += 4;
    }
    ctx.putImageData( img, 0, 0 );
    if( nbFrames --> 0 ) window.requestAnimationFrame( paint );
    var idx = coverage.length;
    var sum = 0;
    var holes = [];
    while( idx --> 0 ) {
      if( coverage[idx] ) sum++;
      else holes.push( idx );
    }
    displayCoverage( sum, holes );
  }
  window.requestAnimationFrame( paint );
}

module.exports = Rnd;
