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
var gcalFunc = require('./google-calendar.js');
var gmailFunc = require('./send-email.js');
var promise = require("promise");

/**
 * Function that calls google calendar API to read birthday events and then sends Happy Birthday emails.
 * @returns
 */
function sendBirthdayEmails() {
    gcalFunc(function(events) {
        if (events.length === 0) {
            console.log('No upcoming events found.');
        }
        else {
            // send email for each event
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s - %s', start, event.summary, event.description);
                // reads name of the person and email address in the next line from description
                if (event.description) {
                    var arr = event.description.split("\n");
                    gmailFunc(arr[0], arr[1]);
                }
                else {
                    console.error('Missing Name/Email of the person');
                }
            }
        }
    });
}

/**
 * Function that waits until 10:00am tomorrow and then calls sendBirthdayEmails().
 * @returns
 */
function callAt10() {
    return new promise(function(resolve, reject) {
        // call for 10:00 tomorrow
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);
        tomorrow.setMilliseconds(0);

        var timeToWait = tomorrow.getTime() - new Date().getTime();
        console.log("Waiting for %d hours, %d minutes and %d seconds\n", ((timeToWait / (1000 * 60 * 60)) % 24).toFixed(), ((timeToWait / (1000 * 60)) % 60).toFixed(), ((timeToWait / 1000) % 60).toFixed());
        

        setTimeout(function() {
                sendBirthdayEmails();
                resolve(true);
            },
            timeToWait);
    });
}


/**
 * Function that calls sendBirthdayEmails() every 24hrs.
 * @returns
 */
function callForEveryDay() {
    console.log('Everyday checking started....')
    setInterval(sendBirthdayEmails, 1000 * 60 * 60 * 24);
}

console.log('Application running ...');
// to read events now and send emails
sendBirthdayEmails();
// call for tomorrow at 10:00am and then everyday at 10:00am
callAt10().then(callForEveryDay);


