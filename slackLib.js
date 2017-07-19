// Slack Library

// Load the library
var slack = require("@slack/client");

// let us access the settings
var settings = require("./settings.js").module("settings");

// get the API token from the settings
const botTokenId = settings.get("bot-token");

// return it to calling context
exports.ClientEvents = slack.CLIENT_EVENTS;
exports.RtmEvents = slack.RTM_EVENTS;
exports.WebApi = new slack.WebClient(botTokenId);

// Connect to slack and return the RTM object.
exports.connect = function () {
    // prepare the connection to slack
    var rtm = new slack.RtmClient(botTokenId);

    // make sure we log a debug message on a successful connection
    rtm.on(exports.ClientEvents.RTM.AUTHENTICATED, function () {
        if (settings.debugMode) {
            console.info("Successfully Connected.");
        }
    });

    // connect to slack
    rtm.start();

    return rtm;
};

// get the channel ID for a user's Direct Messages with the bot
exports.getDMChannel = function (userId, callback) {
    exports.WebApi.im.open(userId, function (err, info) {
        if (err && settings.debugMode)
            console.error("Error in GetDMChannel(" + userId + ")\n", err);
        else
            callback(info.channel.id);
    });
};

// get the user's name from their ID
exports.getUserName = function (userId, callback) {
    exports.WebApi.users.info(userId, function (err, info) {
        if (err && settings.debugMode)
            console.error("Error in getUserName(" + userId + ")\n", err);
        else
            callback(info.user.name);
    });
};

// get the channel's name from the ID
exports.getChannelName = function (channelId, callback) {
    exports.WebApi.channels.info(channelId, function (err, info) {
        if (err && settings.debugMode)
            console.error("Error in getChannelName(" + channelId + ")" + err);
        else
            callback(info.channel.name);
    });
};

// get the channel's name from the ID
exports.getGroupName = function (channelId, callback) {
    exports.WebApi.groups.info(channelId, function (err, info) {
        if (err && settings.debugMode)
            console.error("Error in getGroupName(" + channelId + ")" + err);
        else
            callback(info.group.name);
    });
};
