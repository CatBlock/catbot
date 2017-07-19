/* XKCD Comic Finder for CatBlock Slack Bot
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

var http = require("http");
var globalSettings = require("../settings.js").module("settings");

const HOUR_IN_MS = 60 * 60 * 1000;

// cache the latest number - update every hour
var latestComicNumber = -1;

function updateCache() {
    if (globalSettings.debugMode) {
        console.info("Updating XKCD Cache");
    }
    http.request(new URL("http://xkcd.com/info.0.json"), function (response) {
        var data = JSON.parse(response);
        latestComicNumber = data.num;
    });
}
setInterval(updateCache, HOUR_IN_MS);

function sendComic(rtm, event, args) {
    var comicNumber;
    // update the cache on first use after load if the setInterval hasn't worked yet
    if (latestComicNumber === -1)
        updateCache();

    if (args.length === 0 || isNaN(args[0])) {
        // choose a random comic
        comicNumber = getRandomIntInclusive(1, latestComicNumber);
    }
    else {
        // comic number specified
        comicNumber = parseInt(args[0]);
    }

    var comicInfo = getComic(comicNumber);
    
}

/* getRandomIntInclusive method taken from Mozilla Developer Network.
 * URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * License: "Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/"
 * Retrieved 2017-07-18
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function getComic(number) {

}

require("./license.js").registerModule("xkcd", "https://github.com/CatBlock/catbot", "GNU Affero General Public Licence, version 3", "http://www.gnu.org/licenses/agpl.html");