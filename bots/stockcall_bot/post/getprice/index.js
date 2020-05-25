const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = async (req)=>{
    winston.debug('/stockcall_bot/post/getprice/index.js');
    winston.debug('%o', req.body);
    var bot_name = req.url.substring(5,1000)
    var bot_config = util.get_bot_token(bot_name);
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/`
    winston.debug(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${req.body.command_array[1]}?modules=price%2CsummaryDetail`);
    // get the share price before returning a message
    axios({
        method: 'get',
        headers: {'Content-Type':'application/json'},
        url:`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${req.body.command_array[1]}?modules=price%2CsummaryDetail`
    }).then(function (response) {
        winston.debug('%o',response);
        var return_json = {"chat_id":req.body.message.chat.id,"text":`Current price of ${response.data.quoteSummary.result[0].price.shortName}: ${response.data.quoteSummary.result[0].price.regularMarketPrice.fmt}`};
        // check if callback is true, if it is, edit message
        if (req.is_callback == true){
            api_url = api_url + "editMessageText"
            return_json['message_id'] = req.body.message.message_id;
        } else {
            api_url = api_url + "sendMessage"
        }
        // return the message
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
    }).catch(function (error) {
        winston.debug(error);
        axios({
            method: 'post',
            headers: {'Content-Type':'application/json'},
            url:api_url,
            data: {"chat_id":req.body.message.chat.id,"text":"Please provide a symbol, e.g. `/getprice D05.SI`","parse_mode":"MarkdownV2"}
        }).then(function (response) {
            winston.debug(response);
        }).catch(function (error) {
            winston.debug(error);
        });
    });
    return;
}
