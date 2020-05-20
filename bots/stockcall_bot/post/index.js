const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = (req,res)=>{
    winston.debug('/stockcall_bot/post/index.js');
    winston.debug('%o', req.body);
    var bot_config = util.get_bot_token('stockcall_bot');
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/sendMessage`
    // split the text into array, if any
    if (req.body.message.text != ''){
        winston.debug('splitting of text');
        req.body.message['text_array'] = req.body.message.text.split(' ');
        winston.debug(req.body.message['text_array']);
    }

    if (req.body.message['text_array'][0].slice(0, 1) == '/'){
        winston.debug('help will be provided');
        const command = require(`${appRoot}/bots/stockcall_bot/post${req.body.message['text_array'][0]}`);
        command(req);
    } else {
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
