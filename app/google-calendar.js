/*
MIT License

Copyright (c) 2017 Muzammil Shahbaz <muzammil.shahbaz@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
'use strict';
var googleapis = require('googleapis');
var googleAuth = require('google-auth-library');
var config = require('../config/client_secret.json');

/**
 * Lists today's birthday events. The events are recognized by the title
 * prefixed by 'bd.'. For example, bd. John
 * 
 * @param {google.auth.OAuth2}
 *            auth An authorized OAuth2 client.
 * @param {setEventsCallback}
 *            callback The callback to call after the list of events retrieved.
 */
function listEvents(auth, setEventsCallback) {
	var calendar = googleapis.calendar('v3');
	var today = new Date();
	var tillMidnight = new Date();
	tillMidnight.setHours(23);
	tillMidnight.setMinutes(59);
	calendar.events.list({
		auth : auth,
		calendarId : 'primary',
		timeMin : today.toISOString(),
		timeMax : tillMidnight.toISOString(),
		// maxResults: 10,
		singleEvents : true,
		q : 'bd.',
		orderBy : 'startTime'
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		// return events
		var events = response.items;
		setEventsCallback(events);
	});
}

/**
 * Main function to load Google's secret and read calendar events. For example,
 * bd. John
 * 
 * @param {setEventsCallback}
 *            callback The callback to call after the list of events retrieved.
 */
module.exports = function(callback) {
	// Authorize a client with the loaded credentials, then call the Google
	// Calendar API.
	var clientSecret = config.client_secret;
	var clientId = config.client_id;
	var redirectUrl = config.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
	// set the refresh token so access_token will be automatically retrieved
	oauth2Client.credentials = {
		"refresh_token" : config.refresh_token,
	};
	listEvents(oauth2Client, callback);
};
