/* Help system for CatBlock Slack Bot
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

var settings = require("../settings.js").module("settings");

var slack = require("../slackLib.js");

var loaded_modules = settings.get("loaded_modules");

const command_character = settings.get("command-character");

// list of commands and the functions they use (without the prefix)
// DO NOT put brackets next to the function name
// command names must fit the regex [A-Za-z0-9_]+

var showCommands = function (rtm, event, args) {   
    var message;
    if (args.length === 0) {
        // show all commands
        var allCommands = new Set();
        loaded_modules.forEach(function (moduleName, moduleIndex, allModulesLoaded) {
            var commands = Object.keys(require("./" + moduleName + ".js").command_list);
            commands.forEach(function (commandName, arrayIndex, commandsArray) {
                allCommands.add(commandName);
            });


        });
        var commands = Array.from(allCommands);
        commands.sort();
        message = command_character + commands.join(", " + command_character);
        slack.getDMChannel(event.user, function (channelId) {
            rtm.sendMessage(message, channelId);
            if (event.channel[0] !== "D")
                rtm.sendMessage("<@" + event.user + "> I've sent you a list of commands as a DM!", event.channel);
        });
        
    }
    else {
        // Argument supplied to list, show results for that command
        const command = args[0];
        // find the module it's from
        var found = false;
        loaded_modules.some(function (moduleName, moduleIndex, allModulesLoaded) {
            var module = require("./" + moduleName + ".js");

            if (command in module.command_list) {
                found = true;
                if (module.command_usage && command in module.command_usage)
                    sendDmAndAlertChannel(rtm, event, "Usage: " + command_character + command + " " + module.command_usage[command]);
                else
                    rtm.sendMessage("<@" + event.user + "> " + "No usage info available for " + command_character + command, event.channel);
                
                return true;
            }
            return false;

        });
        if (!found) {
            rtm.sendMessage("<@" + event.user + "> " + command_character + command + " does not exist", event.channel);
        }
    }
};

function sendDmAndAlertChannel(rtm, event, message) {
    slack.getDMChannel(event.user, function (channelId) {
        rtm.sendMessage(message, channelId);
        if (event.channel[0] !== "D")
            rtm.sendMessage("<@" + event.user + "> I've sent usage notes about " + command_character + command + " in a DM!", event.channel);
    });
}

exports.command_list = {
    help: showCommands,
    commands: showCommands
};

exports.command_usage = {
    help: '[command name]',
    commands: '[command name]'
};

require("./licence.js").registerModule("help", "https://github.com/CatBlock/catbot", "GNU Affero General Public Licence, version 3", "http://www.gnu.org/licenses/agpl.html");