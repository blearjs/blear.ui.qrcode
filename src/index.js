/**
 * blear.ui.qrcode
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 */

'use strict';

var UI = require('blear.ui');
var QRCodeGenerator = require('blear.classes.qrcode');
var object = require('blear.utils.object');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');

var supportCanvas = (function () {
    var canvas = document.createElement('canvas');
    return 'getContext' in canvas;
}());
var defaults = {
    el: 'body',
    size: 256,
    background: '#fff',
    foreground: '#000'
};
var QRCode = UI.extend({
    className: 'QRCode',
    constructor: function (options) {
        var the = this;

        the[_container] = selector.query(options.el)[0];
        the[_options] = object.assign({}, defaults, options);
        the[_qrcodeGenerator] = new QRCodeGenerator();
    },


    render: function (data) {
        var the = this;

        the[_qrcodeGenerator].draw(data);
        var el = the[_renderByCanvas]();
        modification.empty(the[_container]);
        modification.insert(el, the[_container]);
        return el;
    }
});
var _options = QRCode.sole();
var _container = QRCode.sole();
var _qrcodeGenerator = QRCode.sole();
var _renderByCanvas = QRCode.sole();
var _renderByTable = QRCode.sole();
var pro = QRCode.prototype;


/**
 * 使用 canvas 渲染
 * @returns {*}
 */
pro[_renderByCanvas] = function () {
    var the = this;

    if (!supportCanvas) {
        return the[_renderByTable]();
    }

    var qrcode = the[_qrcodeGenerator];
    var options = the[_options];

    // create canvas element
    var canvas = document.createElement('canvas');
    canvas.width = options.size;
    canvas.height = options.size;
    var ctx = canvas.getContext('2d');

    // compute tileW/tileH based on options.width/options.height
    var tileW = canvas.width / qrcode.getModuleCount();
    var tileH = canvas.height / qrcode.getModuleCount();

    // draw in the canvas
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
        for (var col = 0; col < qrcode.getModuleCount(); col++) {
            ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
            var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
            var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
        }
    }

    return canvas;
};


/**
 * 使用 table 渲染
 * @returns {*}
 */
pro[_renderByTable] = function () {
    var the = this;
    var qrcode = the[_qrcodeGenerator];
    var options = the[_options];
    var size = options.size;
    var tableEl = modification.create('table', {
        style: {
            width: size,
            height: size,
            border: 0,
            borderCollapse: 'collapse',
            backgroundColor: options.background
        }
    });

    // compute tileS percentage
    var cellWidth = size / qrcode.getModuleCount();
    var cellHeight = size / qrcode.getModuleCount();

    // draw in the table
    for (var row = 0; row < qrcode.getModuleCount(); row++) {
        var trEl = modification.create('tr', {
            style: {
                height: cellHeight
            }
        });
        modification.insert(trEl, tableEl);

        for (var col = 0; col < qrcode.getModuleCount(); col++) {
            var tdEl = modification.create('td', {
                style: {
                    width: cellWidth,
                    backgroundColor: qrcode.isDark(row, col) ? options.foreground : options.background
                }
            });
            modification.insert(tdEl, trEl);
        }
    }

    return tableEl;
};

QRCode.defaults = defaults;
module.exports = QRCode;
