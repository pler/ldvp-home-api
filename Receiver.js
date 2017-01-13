'use strict';

const Yamaha = require('yamaha-nodejs');

function Receiver(addr) {
	this.yamaha = new Yamaha(addr);
}

Receiver.prototype.powerOff = function powerOff (callback) {
	console.log('powerOff');
	this.yamaha.powerOff()
		.then(function () {
			return callback();
		})
		.catch(function (err) {
			return callback(err);
		});
};

module.exports = Receiver;