/* Chat log system for CatBlock Slack Bot
 * Author: Kieran Peckett
 * Copyright © 2017 Kieran Peckett
 * You can contact me through GitHub: github.com/kpeckett
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var fs = require("fs-extra");

var slack = require("../slackLib.js");

var logSettings = require("../settings.js").module("messageLog");
var globalSettings = require("../settings.js").module("settings");

var loggingEnabled = logSettings.get("logging_enabled");

var loggingDir;

var logMessage = function (rtm, event) {
    var dateTime = dateFromTS(event.ts);

    slack.getUserName(event.user, function (username) {
        var type;
        switch (event.channel[0]) {
            case "C":
                type = "Public Channel";
                slack.getChannelName(event.channel, function (channel) { storeLog(username, type, channel, event.text, dateTime); } );
                break;
            case "D":
                type = "Direct Message";
                storeLog(username, type, username, event.text, dateTime);
                break;
            case "G":
                type = "Private Channel";
                slack.getGroupName(event.channel, function (channel) { storeLog(username, type, channel, event.text, dateTime); });
                break;
        }
    });
};

var storeLog = function (username, type, channelName, message, dateTime) {
    var pathArr = [loggingDir, type, channelName];
    var path = pathArr.join("/") + ".log";

    var dateFormat = [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()];
    var timeFormat = [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()];


    // add leading zeroes to single-digit month & date
    for (i = 1; i < 3; i++) {
        if (dateFormat[i] < 10) {
            dateFormat[i] = "0" + dateFormat[i];
        }
    }

    // add leading zeroes to single-digit time segments
    for (i = 0; i < 3; i++) {
        if (timeFormat[i] < 10) {
            timeFormat[i] = "0" + timeFormat[i];
        }
    }
    
    var fullDateTime = dateFormat.join("-") + " " + timeFormat.join(":");

    var fullMessage = fullDateTime + "  " + username + ": " + message;
    fs.appendFile(path, fullMessage + "\r\n", function (err) {
        if (err && globalSettings.debugMode) {
            console.error("Error saving log:\n", err);
        }
        else if (globalSettings.debugMode) {
            console.info("Appended to " + path);
            console.info(fullMessage);
        }
    });
    
};

var dateFromTS = function (ts) {
    if (typeof ts === "string") {
        ts = parseInt(ts, 10); // 10 for base 10
    }

    var dateTime = new Date(ts * 1000); // times 1000 as needs milliseconds since epoch

    return dateTime;
}

// we do not expose any commands
exports.command_list = {};

// only register the handler if logging is turned on
if (loggingEnabled) {
    exports.sendAllMessages = logMessage;
    loggingDir = logSettings.get("logging_directory");

    // make sure all directories needed are ready
    for (dirName of ["Direct Message", "Public Channel", "Private Channel"]) {
        fs.ensureDir(loggingDir + "/" + dirName, function (err) {
            if (err && globalSettings.debugMode) {
                console.error("Tried to create logging subdirectory " + loggingDir + "/" + dirName + ". Failed with error:\n", err3);
            }
            else if (globalSettings.debugMode) {
                console.info("Created logging subdirectory: " + loggingDir + "/" + dirName);
            }
        });
    }
};

require("./license.js").registerModule("messageLog", "https://github.com/CatBlock/catbot", "GNU Affero General Public Licence, version 3", "http://www.gnu.org/licenses/agpl.html");