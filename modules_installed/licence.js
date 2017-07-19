/* Licence information for CatBlock Slack Bot, for
 * the GNU AGPL, which this is licenced under.
 * ***THIS MUST NOT BE REMOVED FROM THE MODULES LIST***
 *
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

var globalSettings = require("../settings.js").module("settings");

var modules_installed = globalSettings.get("loaded_modules");
modules_installed.push("bot");

var command_character = globalSettings.get("command-character");

function returnSourceLink(rtm, event, args) {
    var message = '<@' + event.user + '> ';
    if (args.length < 1 || !(modules_installed.includes(args[0]))) {
        // return error
        message += 'Missing or invalid argument to "' + command_character + 'source". If you want the source of the bot, use "bot" as the module argument.\r\n';
        message += "Valid modules are: " + modules_installed.join(", ");
    }
    else {
        // return source code
        if (Object.keys(licences).includes(args[0])) {
            var pieces = [];
            // module registered
            pieces.push('Information about module "' + args[0] + '"');
            if (licences[args[0]].sourceLink !== null) {
                pieces.push("Source code is available at " + licences[args[0]].sourceLink);
            }
            if (typeof licences[args[0]].licence !== 'undefined' && licences[args[0]].licence !== null) {
                pieces.push("The source code is licenced under the licence: " + licences[args[0]].licence);
                if (typeof licences[args[0]].licenceLink !== 'undefined' && licences[args[0]].licenceLink !== null) {
                    pieces.push("The legal text of this licence can be found at " + licences[args[0]].licenceLink);
                }
            }
            message += pieces.join("\r\n");
        }
        else {
            // module not registered
            message += 'Module "' + args[0] + '" has not shared its licence information with me.\r\n';
            message += 'Contact the module author for more information on your rights to use the source code of "' + args[0] + '".';
        }

    }
    rtm.sendMessage(message, event.channel);
}



exports.command_list = {
    source: returnSourceLink
};

/* Register module's source code and licence information.
 * This is a requirement for some Free Software and Open Source licences, such as the GNU Affero General Public Licence.
 *
 * Arguments:
 *     module: <string> The name of the module to register. Do not register another module from within your module
 *     source: <string> The URL (including http:// or https://) where you can locate the source repository. Leave null to not show.
 *     licence: <string> The full name and version (if applicable) of the licence you are using, e.g. GNU Affero General Public Licence, version 3, leave null or undefined to not show
 *     licenceLink: <string> The URL to access the licence listed in the "licence" argument, leave null or undefined to not show
 * 
 *  Example:
 *     licence.registerModule("xkcd", "https://github.com/CatBlock/catbot", "GNU Affero General Public Licence, version 3", "http://www.gnu.org/licenses/agpl.html");
 */
exports.registerModule = function (module, source, licence, licenceLink) {
    licences[module] = {
        sourceLink: source,
        licence: licence,
        licenceLink: licenceLink
    }
}

var licences = {
    bot: { 
        sourceLink: "https://github.com/CatBlock/catbot",
        licence: "GNU Affero General Public Licence, version 3",
        licenceLink: "http://www.gnu.org/licenses/agpl.html"
    },
    licence: {
        sourceLink: "https://github.com/CatBlock/catbot",
        licence: "GNU Affero General Public Licence, version 3",
        licenceLink: "http://www.gnu.org/licenses/agpl.html"
    }
}