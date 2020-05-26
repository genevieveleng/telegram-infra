const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = (req,res)=>{
    winston.debug('/stockcall_bot/post/index.js');
    winston.debug('%o', req.body);
    var bot_name = req.url.substring(5,1000)
    var bot_config = util.get_bot_token(bot_name);
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/sendMessage`
    
    // if is callback, standardise the JSON for all scripts to process
    winston.debug('standardizing the JSON + splitting of command');
    if (typeof(req.body.callback_query) == 'object' ) {
        winston.debug('it is a callback');
        req.body['is_callback'] = true;
        req.body['message'] = req.body.callback_query.message;
        req.body['command_array'] = req.body.callback_query.data.split(' ');
    } else if (typeof(req.body.edited_message) == 'object' ) {
        winston.debug('it is a edited message');
        req.body['is_callback'] = false;
        req.body['message'] = req.body.edited_message;
        req.body['command_array'] = req.body.edited_message.text.split(' ');
    } else {
        winston.debug('it is a normal message');
        req.body['is_callback'] = false;
        req.body['command_array'] = req.body.message.text.split(' ');
    }

    // to ensure all types of replies has an answer (quick hack, will be changed soon)
    try {
        if (req.body.command_array[0].slice(0, 1) == '/'){
            winston.debug('help will be provided');
            const command = require(`${appRoot}/bots/stockcall_bot/post${req.body.command_array[0]}`);
            command(req);
        } else {
            throw new TypeError("Command cannot be understood");
        }
    } catch {
        var return_json = {"chat_id":req.body.message.chat.id,"text":"i don't understand you..."};
        axios({
            method: 'post',
            headers: {'Content-Type':'application/json'},
            url:api_url,
            data: return_json
        }).then(function (response) {
            winston.debug(response);
        }).catch(function (error) {
            winston.debug(error);
        });
    }
    
    res.send('ok');    
}