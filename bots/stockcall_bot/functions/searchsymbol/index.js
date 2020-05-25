const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const axios = require('axios');
const util = require(`${appRoot}/util`);

module.exports = async (query_str)=>{
    winston.debug('/stockcall_bot/function/searchsymbol/index.js');
    return new Promise ((resolve, reject) => {
        axios({
            method: 'get',
            headers: {'Content-Type':'application/json'},
            url:`https://query2.finance.yahoo.com/v1/finance/search?q=${query_str}&quotesCount=6&newsCount=0`
        }).then(function (response) {
            winston.debug(response);
            resolve(response);
        }).catch(function (error) {
            winston.debug(error);
            reject(error);
        });
    });
}
