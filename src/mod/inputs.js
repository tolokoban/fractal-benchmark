"use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
var Flex = require("wdg.flex");
var Button = require("wdg.button");
/**
 * @class Inputs
 *
 * @param {boolean} opts.visible - Set the visiblity of the component.
 *
 * @example
 * var Inputs = require("Inputs");
 * var instance = new Inputs({ visible: false });
 */
var Inputs = function(opts) {
    var that = this;
    var tbl = $.div('table', [
      $.tag('div', [
        $.div('th', ['Probability']),
        $.div('th', ['M11']),
        $.div('th', ['M12']),
        $.div('th', ['M21']),
        $.div('th', ['M22']),
        $.div('th', ['Tx']),
        $.div('th', ['Ty'])
      ])
    ]);
    var btnView = new Button({ text: "Show result", icon: "show", type: 'simple' });
    var btnReset = new Button({ text: "Reset", icon: "gear", type: "simple"});
    var elem = $.elem( this, 'div', 'inputs',
      [tbl, new Flex({ content: [btnView, btnReset] })] );
    var inputs = {};
    btnReset.on(function() {
        that.value = {
          pa: 850, m11a:  0.85, m12a:  0.04, m21a: -0.04, m22a: 0.85, vxa: 0, vya: 1.6,
          pb:  10, m11b:  0.0,  m12b:  0.0 , m21b:  0.0 , m22b: 0.19, vxb: 0, vyb: 0.0,
          pc:  70, m11c:  0.2 , m12c: -0.26, m21c:  0.23, m22c: 0.22, vxc: 0, vyc: 1.6,
          pd:  70, m11d: -0.15, m12d:  0.28, m21d:  0.26, m22d: 0.24, vxd: 0, vyd: 0.44
        };
    });
    btnView.on(function() {
      var value = {};
      var key, input;
      for( key in inputs) {
        input = inputs[key];
        value[key] = parseFloat( input.value );
        if( isNaN(value[key]) ) {
          value[key] = 0;
          input.value = 0;
        }
      }
      DB.set( that, 'value', value );
      DB.fire( that, 'value' );
    });
    ['a','b','c','d'].forEach(function (letter) {
      var row = $.div('td');
      $.add( tbl, row );
      ['p', 'm11', 'm12', 'm21', 'm22', 'vx', 'vy'].forEach(function (name) {
        var id = name + letter;
        var cell = $.div( name );
        $.add( row, cell );
        var input;
        if( name == 'p' ) {
          input = $.tag('input', { size: 3, maxlength: 3 });
        } else {
          input = $.tag('input', { size: 6, maxlength: 6 });
        }
        $.add( cell, input );
        inputs[id] = input;
      });
    });
    DB.propRemoveClass( this, 'visible', 'hide' );
    DB.prop( this, 'value' )(function(v) {
      var k, value;
      for( k in inputs ) {
        value = v[k];
        if( typeof value === 'undefined' ) continue;
        inputs[k].value = parseFloat(value);
      }
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
};


module.exports = Inputs;
