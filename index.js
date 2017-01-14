'use strict';

const express = require('express');
const format = require('util').format;

const Receiver = require('./devices/Receiver');
const FireTv = require('./devices/FireTv');

// -------------
// Globals
// -------------

const LDVP_PORT = process.env.LDVP_PORT || '45000';
const LDVP_RECEIVER_IP = process.env.LDVP_RECEIVER_IP || '192.168.178.22';
const LDVP_FIRETV_IP = process.env.LDVP_FIRETV_IP || 'http://192.168.178.24:5556';

// -------------
// Init
// -------------

console.log('Starting LDVP Alexa service');

const app = express();
const receiver = new Receiver(LDVP_RECEIVER_IP);
const firetv = new FireTv(LDVP_FIRETV_IP);

// -------------
// Router
// -------------

app.use(function (req, res, next) {
	console.log(format('%s incoming request:  %s %s', new Date().toISOString(), req.method, req.originalUrl));
	req.on('end', function () {
		console.log(format('%s response status code: %s', new Date().toISOString(), res.statusCode));
	});
	next();
});


app.get('/receiver/poweron', function (req, res) {
	receiver.powerOn(function (err) {
		if (err) {
			return res.status(500).json(_message('Sorry, ich konnte den Receiver nicht einschalten.'));
		}
		return res.status(200).json(_message('Ok. Receiver eingeschaltet.'));
	});
});

app.get('/receiver/poweroff', function (req, res) {
	receiver.powerOff(function (err) {
		if (err) {
			return res.status(500).json(_message('Sorry, ich konnte den Receiver nicht ausschalten.'));
		}
		return res.status(200).json(_message('Ok. Receiver ausgeschaltet.'));
	});
});

app.get('/receiver/setVolumeTo/:volumeLevel', function (req, res) {
	receiver.setVolumeTo(req.params.volumeLevel, function (err) {
		if (err) {
			return res.status(500).json(_message(err.message || 'Sorry, ich konnte die Lautstärke nicht setzen.'));
		}
		return res.status(200).json(_message('Ok. Ich habe die Lautstärke auf ' + req.params.volumeLevel + ' gesetzt.'));
	});
});

app.get('/receiver/setInputTo/:inputChannel', function (req, res) {
	receiver.setMainInputTo(req.params.inputChannel, function (err) {
		if (err) {
			return res.status(500).json(_message(err.message || 'Sorry, ich konnte nicht auf diesen Einganz wechseln.'));
		}
		return res.status(200).json(_message('Ok. Ich habe auf den Eingang ' + req.params.inputChannel + ' gewechselt.'));
	});
});

app.get('/firetv/apps/:appId/start', function (req, res) {
	receiver.setMainInputTo('firetv', function () {
		firetv.startApp(req.params.appId, function (err, rc, body) {
			if (err) {
				return res.status(500).json(_message(err.message || 'Sorry, ich konnte diese app nicht starten.'));
			}
			return res.status(200).json(_message(format('Ok. %s gestartet.', req.params.appId)));
		});
	});
});

app.get('/firetv/action/:actionId', function (req, res) {
	firetv.triggerAction(req.params.actionId, function (err, rc, body) {
		if (err) {
			return res.status(500).json(_message(err.message || 'Sorry, ich konnte diese aktion nicht ausführen.'));
		}
		return res.status(200).json(_message(format('Ok. %s ausgeführt.', req.params.actionId)));
	});
});

app.listen(LDVP_PORT, function () {
	console.log('Listening to HTTP traffic on port:', LDVP_PORT);
});

// -------------
// Helpers
// -------------

function _message(text) {
	return { message: text };
}

