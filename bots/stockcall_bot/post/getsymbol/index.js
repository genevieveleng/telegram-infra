const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = async (req)=>{
    winston.debug('/stockcall_bot/post/getsymbol/index.js');
    winston.debug('%o', req.body);
    var bot_name = req.url.substring(5,1000)
    var bot_config = util.get_bot_token(bot_name);
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/sendMessage`
    
    // search for symbol
    var query_str = req.body.command_array;
    query_str.shift();
    query_str = query_str.join(' ');
    const SearchSymbol = require(`${appRoot}/bots/stockcall_bot/functions/searchsymbol`);
    SearchSymbol(query_str).then(function (response) {
        var inline_keyboard_json = []
        // loop through the list to generate inline keyboard
        response.data.quotes.forEach(function(e, i) {
            inline_keyboard_json.push({"text": `${e.symbol} - ${e.shortname}`, "callback_data": `/getprice ${e.symbol}`});
        });

        // ask user to choose 1 symbol
        var return_json = {"chat_id":req.body.message.chat.id
            ,"text":"Please choose a symbol to get the price."
            ,"parse_mode":"MarkdownV2"
            , "reply_markup":{"inline_keyboard":[inline_keyboard_json]}};
        winston.debug('%o',return_json);
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
    },function (error) {
        winston.debug('error');
        winston.debug(error);
    });
}
