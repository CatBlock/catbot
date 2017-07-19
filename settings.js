// get and set settings programmatically

var fs = require("fs-extra");

class settingsFile {
    constructor(module) {
        this.module = module;

        // load the values up
        this._firstLoad();

        // load the debug mode into the object if module === settings
        if (module === "settings")
            this.debugMode = this._settings["debug_mode"]; // If changed whilst running, will not update until restart of app
    }

    // First load only
    _firstLoad() {
        // Load the settings synchronously. Only use for first load to reduce lag
        var module = this.module;
        var info = fs.readFileSync("./config/" + module + ".json", "utf8");
        if (typeof info === "undefined")
            console.error("Error loading config file: " + module + ".json");
        else {
            this._settings = JSON.parse(info);
        }
    }

    // Reload the settings
    reload() {
        var module = this.module;
        fs.readFile("./config/" + module + ".json", "utf8", function (err, info) {
            if (err && this.debugMode)
                console.error("Error in reload({module: " + module + "})\n", err);
            else {
                var settingsFile = info;
                this._settings = JSON.parse(settingsFile);
            }
        });
    }

    // Get a setting from the settings.
    get(setting) {
        var settingData = this._settings[setting];
        // should we dump the output?
        if (this.debugMode)
            console.info("Getting setting: " + setting + "\n", settingData);
        return settingData;
    }

    // Save a setting to the disk
    set(setting, value) {
        // change it in memory
        this._settings[setting] = value;

        // save to disk
        var JSONToSave = JSON.stringify(this._settings);
        fs.writeFile("./config/" + this.module + ".json", JSONToSave, "utf8", function (err) {
            if (err && this.debugMode)
                console.error("Error in writing file settings.set(" + setting + ", " + value + ")\n", err);
        });

        // reload settings just in case
        reload();
    }
}

exports.module = function (module) {
    return new settingsFile(module);
};
