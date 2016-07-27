/**
 * 文件描述
 * @author ydr.me
 * @create 2016-06-27 17:34
 */


'use strict';


var QRCode = require('../src/index');

var qrcode = new QRCode({
    el: '#ret'
});

var textareaEl = document.querySelector('#textarea');
var renderEl = document.querySelector('#render');

renderEl.onclick = function () {
    qrcode.render(textareaEl.value);
};
