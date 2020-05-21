const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = async (req)=>{
    winston.debug('/stockcall_bot/post/help/index.js');
    winston.debug('%o', req.body);
    var bot_name = req.url.substring(5,1000)
    var bot_config = util.get_bot_token(bot_name);
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/sendMessage`
    var return_json = {"chat_id":req.body.message.chat.id,"text":"try `/getprice DBS`","parse_mode":"MarkdownV2"};
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
