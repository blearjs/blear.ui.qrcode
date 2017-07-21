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
var timeEl = document.querySelector('#time');

renderEl.onclick = function () {
    var startTime = Date.now();
    timeEl.innerHTML = '...';
    qrcode.render(textareaEl.value);
    timeEl.innerHTML = Date.now() - startTime + 'ms';
};
