const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = async (req)=>{
    winston.debug('/stockcall_bot/post/help/index.js');
    winston.debug('%o', req.body);
    var bot_config = util.get_bot_token('stockcall_bot');
    var api_url = `https://api.telegram.org/bot${bot_config['id']}:${bot_config['hash']}/sendMessage`
    // get the share price before returning a message
    axios({
        method: 'get',
        headers: {'Content-Type':'application/json'},
        url:'https://query2.finance.yahoo.com/v10/finance/quoteSummary/D05.SI?modules=price%2CsummaryDetail',
        params: {"modules":"price%2CsummaryDetail"}
    }).then(function (response) {
        winston.debug(response);
        //returning a message
        winston.debug('%o',response);
        var return_json = {"chat_id":req.body.message.chat.id,"text":`Current price of ${response.data.quoteSummary.result[0].price.shortName}: ${response.data.quoteSummary.result[0].price.regularMarketPrice.fmt}`};
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
    });
    
}
