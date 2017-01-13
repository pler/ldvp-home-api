'use strict';

const Yamaha = require('yamaha-nodejs');

function Receiver(addr) {
	this.yamaha = new Yamaha(addr);
}


Receiver.prototype.powerOn = function powerOn (callback) {
	console.log('powerOn');
	this.yamaha.powerOn()
		.then(function () {
			return callback();
		})
		.catch(function (err) {
			return callback(err);
		});
};

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

Receiver.prototype.setVolumeTo = function setVolumeTo (volumeLevel, callback) {

	var errmsgInvalidParam = 'Der angegebene Lautstärkewert ist ungültig. Bitte gebe eine ganze Zahl zwischen 0 und 80 an.';
	
	if( !isNaturalNumber(volumeLevel) )
	{
		console.log(errmsgInvalidParam);
		return callback(new Error(errmsgInvalidParam));
	}
	
	var volumeLevelMapped = parseInt(volumeLevel);
	
	if ( volumeLevelMapped < 0 || volumeLevelMapped > 80)
	{
		console.log(errmsgInvalidParam);
		return callback(new Error(errmsgInvalidParam));
	}
	
	volumeLevelMapped = volumeLevelMapped * -10;
	
	console.log('Setting volume level to ' + (volumeLevelMapped / 10) + 'db');
	
	this.yamaha.setVolumeTo(volumeLevelMapped)
		.then(function () {
			return callback();
		})
		.catch(function (err) {
			return callback(err);
		});
};


// Source: http://stackoverflow.com/a/16799758
function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    var n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

module.exports = Receiver;