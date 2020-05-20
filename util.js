const appRoot = require('app-root-path');
const fs = require('fs');
const path = require('path');

this.get_bot_token = (bot_name) => {
    var config = [];
    try {
        var strConfigPath = path.join(appRoot.toString(), '.', 'secrets', bot_name+'.json');
        var jsonString = fs.readFileSync(strConfigPath);
        config = JSON.parse(jsonString);
      } catch(err) {
        console.log(err);
        return err;
      }
    return config;
}

module.exports = this;
