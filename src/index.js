/**
 * blear.ui.qrcode
 * @author ydr.me
 * @create 2016年06月04日14:09:36
 * @update 2017年04月27日15:06:04
 */

'use strict';

var UI = require('blear.ui');
var QRCodeGenerator = require('blear.classes.qrcode');
var object = require('blear.utils.object');
var selector = require('blear.core.selector');
var modification = require('blear.core.modification');

// var supportCanvas = (function () {
//     var canvas = document.createElement('canvas');
//     return 'getContext' in canvas;
// }());
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
    },


    /**
     * 渲染文本为二维码
     * @param text {String} 文本
     * @returns {QRCode}
     */
    render: function (text) {
        var the = this;

        the[_qrcodeGenerator] = new QRCodeGenerator(text, 3);
        var el = the[_renderByCanvas]();
        modification.empty(the[_container]);
        modification.insert(el, the[_container]);
        return the;
    }
});
var _options = QRCode.sole();
var _container = QRCode.sole();
var _qrcodeGenerator = QRCode.sole();
var _renderByCanvas = QRCode.sole();
var _renderByTable = QRCode.sole();
var _renderBySVG = QRCode.sole();
var pro = QRCode.prototype;


/**
 * 使用 canvas 渲染
 * @returns {*}
 */
pro[_renderByCanvas] = function () {
    var the = this;
    var qrCodeAlg = the[_qrcodeGenerator];
    var options = the[_options];

    // create canvas element
    var canvas = document.createElement('canvas');
    canvas.width = options.size;
    canvas.height = options.size;
    var ctx = canvas.getContext('2d');
    var count = qrCodeAlg.getModuleCount();

    // compute tileW/tileH based on options.width/options.height
    var tileW = canvas.width / count;
    var tileH = canvas.height / count;

    // draw in the canvas
    for (var row = 0; row < count; row++) {
        for (var col = 0; col < count; col++) {
            ctx.fillStyle = qrCodeAlg.isDark(row, col) ? options.foreground : options.background;
            var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
            var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
            ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h);
        }
    }

    return canvas;
};


// /**
//  * 使用 table 渲染
//  * @returns {*}
//  */
// pro[_renderByTable] = function () {
//     var the = this;
//     var qrcode = the[_qrcodeGenerator];
//     var options = the[_options];
//     var size = options.size;
//     var tableEl = modification.create('table', {
//         style: {
//             width: size,
//             height: size,
//             border: 0,
//             borderCollapse: 'collapse',
//             backgroundColor: options.background
//         }
//     });
//     var count = qrcode.getModuleCount();
//
//     // 计算每个节点的长宽；取整，防止点之间出现分离
//     var cellWidth = Math.floor(size / count);
//     var cellHeight = Math.floor(size / count);
//
//     if(cellWidth <= 0){
//         cellWidth = count < 80 ? 2 : 1;
//     }
//
//     if(cellHeight <= 0){
//         cellHeight = count < 80 ? 2 : 1;
//     }
//
//     // draw in the table
//     for (var row = 0; row < count; row++) {
//         var trEl = modification.create('tr', {
//             style: {
//                 height: cellHeight
//             }
//         });
//         modification.insert(trEl, tableEl);
//
//         for (var col = 0; col < count; col++) {
//             var tdEl = modification.create('td', {
//                 style: {
//                     width: cellWidth,
//                     backgroundColor: qrcode.isDark(row, col) ? options.foreground : options.background
//                 }
//             });
//             modification.insert(tdEl, trEl);
//         }
//     }
//
//     return tableEl;
// };


// /**
//  * 使用 svg 渲染
//  * @returns {*}
//  */
// pro[_renderBySVG] = function () {
//     var the = this;
//     var options = the[_options];
//     var qrCodeAlg= the[_qrcodeGenerator];
//     var count = qrCodeAlg.getModuleCount();
//     var size = options.size;
//     var scale = count / options.size;
//
//     // create svg
//     var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//     svg.setAttribute('width', size);
//     svg.setAttribute('height', size);
//     svg.setAttribute('viewBox', [0,0,count, count].join(' '));
//
//     for (var row = 0; row < count; row++) {
//         for (var col = 0; col < count; col++) {
//             var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//             var foreground = qrCodeAlg.isDark(row, col);
//
//             rect.setAttribute('x', col);
//             rect.setAttribute('y', row);
//             rect.setAttribute('width', 1);
//             rect.setAttribute('height', 1);
//             rect.setAttribute('stroke-width', 0);
//
//             if(qrCodeAlg.modules[row][ col]){
//                 rect.setAttribute('fill', foreground);
//             }else{
//                 rect.setAttribute('fill', options.background);
//             }
//
//             svg.appendChild(rect);
//         }
//     }
//
//     return svg;
// };

QRCode.defaults = defaults;
module.exports = QRCode;
