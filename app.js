'use strict';

// load our interface with the slack library
var slack = require("./slackLib.js");

// let the application access the settings
var settings = require("./settings.js").module("settings");

// load the message handlers
var handlers = require("./messageHandlers.js");

// connect to slack
var rtm = slack.connect();

// handle messages
rtm.on(slack.RtmEvents.MESSAGE, function (message) {
    if (settings.debugMode)
        console.info("Message recieved: \n", message);
    handlers.handle(rtm, message);
});