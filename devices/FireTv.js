'use strict';

var request = require('request');
var path = require('path');

// -------------
// Globals
// -------------

const APP_MAPPING = {
	'netflix': 'com.netflix.ninja',
	'ard': 'com.daserste.daserste',
	'spotify': 'com.spotify.tv.android',
	'youtube': 'org.chromium.youtube_apk',
	'zdf': 'com.zdf.android.mediathek',
	'feuer': 'com.screenview.amazontoastyfireplace'
};

const ACTION_MAPPING = {
	'home': 'home',
	'play': 'media_play',
	'on': 'turn_on',
	'an': 'turn_on',
	'off': 'turn_off',
	'aus': 'turn_off'
};

// -------------
// Init
// -------------

function FireTv(host, device) {
	this.host = host;
	this.device = device || "default";
}

// See https://github.com/happyleavesaoc/python-firetv

FireTv.prototype.startApp = function (appId, callback) {
	if (typeof appId !== 'string') {
		return callback(new Error('Invalid input format'));
	}
	appId = appId.toLowerCase();
	if (!APP_MAPPING[appId]) {
		return callback(new Error('Unknown app: ' + appId));
	}
	this._get(path.join('/devices/', this.device, 'apps', APP_MAPPING[appId], 'start'), callback);
};

FireTv.prototype.triggerAction = function (actionId, callback) {
	if (typeof actionId !== 'string') {
		return callback(new Error('Invalid input format'));
	}
	actionId = actionId.toLowerCase();
	if (!ACTION_MAPPING[actionId]) {
		return callback(new Error('Unknown action: ' + actionId));
	}
	this._get(path.join('/devices/action', this.device, ACTION_MAPPING[actionId]), callback);
};

FireTv.prototype._get = function (path, callback) {
	request.get(this.host + path, callback);
};

FireTv.APP_MAPPING = APP_MAPPING;
FireTv.ACTION_MAPPING = ACTION_MAPPING;

module.exports = FireTv;