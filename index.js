'use strict';

const express = require('express');
const format = require('util').format;

const Receiver = require('./receiver');

// -------------
// Globals
// -------------

const LDVP_PORT = process.env.LDVP_PORT || '45000';
const LDVP_RECEIVER_IP = process.env.LDVP_RECEIVER_IP || '192.168.178.22';

// -------------
// Init
// -------------

const app = express();
const receiver = new Receiver(LDVP_RECEIVER_IP);


// -------------
// Router
// -------------

app.use(function (req, res, next) {
	console.log(format('%s in  %s %s', new Date().toISOString(), req.method, req.originalUrl));
	req.on('end', function () {
		console.log(format('%s out %s', new Date().toISOString(), res.statusCode));
	});
	next();
});

app.get('/receiver/poweroff', function (req, res) {
	receiver.powerOff(function (err) {
		if (err) {
			return res.status(500).json(_message('Unable to turn off receiver'));
		}
		return res.status(200).json(_message('Ok'));
	});
});

app.listen(LDVP_PORT, function () {
	console.log('Listening to port:', LDVP_PORT);
});

// -------------
// Helpers
// -------------

function _message(text) {
	return { message: text };
}

