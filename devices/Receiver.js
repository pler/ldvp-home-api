'use strict';

const Yamaha = require('yamaha-nodejs');

// -------------
// Globals
// -------------

const INPUT_MAPPING = {
	'kodi': 'HDMI1',
	'firetv': 'HDMI2',
	'playstation': 'HDMI3',
	'webradio': 'NET RADIO'
};

// -------------
// Init
// -------------

function Receiver(addr) {
	this.yamaha = new Yamaha(addr);
}

// See https://github.com/PSeitz/yamaha-nodejs

Receiver.prototype.powerOn = function powerOn (callback) {
	console.log('Yamaha: power on');
	this.yamaha.powerOn()
		.then(function () {
			return callback();
		})
		.catch(function (err) {
			return callback(err);
		});
};

Receiver.prototype.powerOff = function powerOff (callback) {
	console.log('Yamaha: power off');
	this.yamaha.powerOff()
		.then(function () {
			return callback();
		})
		.catch(function (err) {
			return callback(err);
		});
};

Receiver.prototype.setVolumeTo = function setVolumeTo (volumeLevel, callback) {
	console.log('Yamaha: set volume to ' + volumeLevel);

	var that = this;
	this.yamaha.isOn().then(function (result) {
		if ( !result ){
			return callback(new Error('Der Receiver ist im Moment nicht eingeschaltet.'));
		}
		else
		{
			var errmsgInvalidParam = 'Bitte gib eine ganze Zahl zwischen 0 und 80 an.';

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

			that.yamaha.setVolumeTo(volumeLevelMapped)
				.then(function () {
					return callback();
				})
				.catch(function (err) {
					console.log('Error during volume setting');
					return callback(err);
				});
		}
	});


};

Receiver.prototype.setMainInputTo = function setMainInputTo (inputChannel, callback) {
	console.log('Yamaha: set input to ' + inputChannel);

	var that = this;
	this.yamaha.isOn().then(function (isOn) {
		if (!isOn){
			that.yamaha.powerOn().then(function () {
				return _switchMainInput();
			});
		} else {
			return _switchMainInput();
		}

		function _switchMainInput() {

			inputChannel = inputChannel.toLowerCase();

			var inputChannelMapped = INPUT_MAPPING[inputChannel];

			if ( !inputChannelMapped )
			{
				var errMsgInvalidInput = 'Diesen Eingang kenne ich leider nicht.';
				console.log(errMsgInvalidInput);
				return callback(new Error(errMsgInvalidInput));
			}

			console.log('Setting input to ' + inputChannelMapped);

			that.yamaha.setMainInputTo(inputChannelMapped)
				.then(function () {
					return callback();
				})
				.catch(function (err) {
					console.log('Error during input channel setting');
					return callback(err);
				});
		}
	});
};

Receiver.INPUT_MAPPING = INPUT_MAPPING;

// Source: http://stackoverflow.com/a/16799758
function isNaturalNumber(n) {
    n = n.toString(); // force the value incase it is not
    var n1 = Math.abs(n),
        n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}

module.exports = Receiver;