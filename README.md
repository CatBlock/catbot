# CatBlock Slack Bot Node.js

This is the source code for the chatbot used on the CatBlock slack team. This is still in testing, and has many bugs yet to be found.

## Installation
1. Download a [ZIP file of this repository](https://github.com/CatBlock/catbot/archive/master.zip), and extract it to somewhere you can find.
2. Install a recent version of Node.js. (If you're on Linux, make sure it's near the version numbers listed on <http://nodejs.org>, as some still have version 0.10 on the package managers)
    * Try [creationix/nvm](https://github.com/creationix/nvm), if you need a newer version. It's a bash script that can install Node.js and npm to your home directory.
3. Update npm by running `npm install npm@latest -g` in the Terminal or Command Prompt
4. Still on the Terminal / Command Prompt, navigate to the directory you extracted the ZIP file to.
5. Run `npm install` in that directory.
6. Rename all files in the `config` folder to remove "-sample" from the name. For example, `settings-sample.json` becomes `settings.json`.
    * Feel free to edit the settings in these files. Enabling debug mode is recommended until we reach v1.0, to make it clearer what caused the bugs for when you report them.
	* You will need to create a bot user in your Slack custom integrations, and copy & paste the bot's API key into settings.js
7. Go back to the root of the extracted ZIP, and run `node app.js` to start the bot.
