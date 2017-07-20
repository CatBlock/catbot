// Message Handler Functions for CatBlock slack bot.

var settings = require("./settings.js").module("settings");

const loaded_modules = settings.get("loaded_modules");

const command_character = settings.get("command-character");

// load all loaded modules. Node will cache them
// This allows any setup that needs to be done by the module to happen
// during bot load, rather than on first execution
loaded_modules.forEach(function (value, index, array) {
    require("./modules_installed/" + value + ".js");
});

exports.handle = function (rtm, event) {
    // if it's a command, handle it as appropriate.
    handleCommands();

    // send all messages to logging systems or modules with more complex needs
    // than a command
    handleAll();

};

function handleCommands(rtm, event) {
    // check for commands
    if (event.text[0] === command_character) {

        // split the input into a command and 
        var commandSplit = event.text.split(/ +/); // using a Regex to skip repeated spaces together
        var commandName = commandSplit[0].substring(1); // substring(1) strips the command character
        var commandArgs = commandSplit.slice(1); // Index 0 is the command, index 1 onwards are the arguments. Empty array if no args

        if (settings.debugMode) {
            console.info("Command detected, " + commandName);
            if (commandArgs.length > 0)
                console.info("  Arguments: ", commandArgs);
            else
                console.info("  No arguments submitted.");
        }

        // find which function to call. Will only call one.
        // Array.some is like forEach but exits on "return true"
        loaded_modules.some(function (moduleName, moduleIndex, allModulesLoaded) {
            var module = require("./modules_installed/" + moduleName + ".js");

            if (commandName in module.command_list) {
                if (settings.debugMode)
                    console.info("  Handling command with module " + moduleName);
                module.command_list[commandName](rtm, event, commandArgs);

                return true; // exit the loop
            }
            return false; // continue the loop

        });
    }
}

function handleAll(rtm, event) {
    // send to any modules that request all messages
    loaded_modules.forEach(function (value, index, array) {
        var module = require("./modules_installed/" + value + ".js");
        if ("sendAllMessages" in module) {
            module.sendAllMessages(rtm, event);
        }
    });
}