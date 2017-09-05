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
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var config = require('../config/client_secret.json');
var emailSettings = require('../config/email_message_settings.json');

// login to gmail account using OAuth2
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    	type: 'OAuth2',
        user: config.user,
        clientId: config.client_id,
        clientSecret: config.client_secret,
        refreshToken: config.refresh_token        
    }
});

/**
 * Sends email to buddyName at buddyEmailAddress
 */
module.exports = function(buddyName, buddyEmailAddress) {
	// setup email data
	var mailOptions = {
	    from: emailSettings.from, // sender email
	    to: buddyEmailAddress, // recipient email
	    bcc: emailSettings.bcc, // bcc
	    subject: emailSettings.subject, // Subject line
	    // email contents
	    html: emailSettings.html_message.replace("{{buddyName}}", buddyName) + emailSettings.sender_name
	};
	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
}
