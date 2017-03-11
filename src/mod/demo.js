"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Msg = require("tfw.message").info;
var Modal = require('wdg.modal');
var Button = require('wdg.button');

var W = 640, H = 640, Z = -64;
var CX = W / 2, CY = H - 0;

module.exports = function( obj, render, opts ) {
  if( typeof opts === 'undefined' ) opts = {};
  if( typeof opts.text === 'undefined' ) opts.text = 'Launch demo...';
  if( typeof opts.frames !== 'number' ) opts.frames = 25;
  if( typeof opts.dots !== 'number' ) opts.dots = 25000000;

  var btn = new Button({ text: opts.text, icon: "show" });
  btn.on( launch.bind( this, render, opts ) );
  $.elem( obj, 'div', [btn], "demo-button" );
};


function launch( render, opts ) {
  var nbDots = (opts.dots)|0;
  var nbFrames = (opts.frames)|0;
  var dotsPerFrame = (nbDots / nbFrames)|0;

  var canvas = $.tag('canvas', { width: W, height: H });
  var title = $.tag('center', [
    'Ploting ' + nbDots + ' dots in ' + nbFrames + ' frames...']);
  var ctx = canvas.getContext( '2d' );
  var btn = Button.Close();
  btn.enabled = false;
  var modal = new Modal({ content: [
    title, canvas, $.tag('hr'), $.tag('center', [btn])
  ]});
  modal.attach();
  btn.on(modal.detach.bind( modal ));

  var start = performance.now();
  var done = function() {
    var txt = nbDots + " dots in " +
      (.001 * (performance.now() - start)).toFixed( 3 ) +
      " seconds.";
    Msg(txt);
    title.textContent = txt;
    btn.enabled = true;
  };

  var x = 0, y = 0;
  var p, xx, yy;
  var pa = 85;
  var vxa = 0, vya = 1.6;
  var m11a = .85, m12a = .04;
  var m21a = -.04, m22a = .85;
  var pb = 1;
  var vxb = 0, vyb = 0;
  var m11b = 0, m12b = 0;
  var m21b = 0, m22b = .16;
  var pc = 7;
  var vxc = 0, vyc = 1.6;
  var m11c = .2, m12c = -.26;
  var m21c = .23, m22c = .22;
  var pd = 7;
  var vxd = 0, vyd = .44;
  var m11d = -.15, m12d = .28;
  var m21d = .26, m22d = .24;

  // Normalize probabilities.
  var totalProb = pa + pb + pc + pd;
  pa /= totalProb;
  pb /= totalProb;
  pc /= totalProb;
  pd /= totalProb;
  pb += pa;
  pc += pb;
  pd += pc;

  ctx.fillStyle = '#000';
  ctx.fillRect( 0, 0, W, H );

  window.setTimeout(function() {
    render(
        done, canvas, dotsPerFrame, nbFrames,
        W, H, CX, CY, Z,
        pa, vxa, vya, m11a, m12a, m21a, m22a,
        pb, vxb, vyb, m11b, m12b, m21b, m22b,
        pc, vxc, vyc, m11c, m12c, m21c, m22c,
        pd, vxd, vyd, m11d, m12d, m21d, m22d
    );
  }, 500);
}
