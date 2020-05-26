const appRoot = require('app-root-path');
const winston = require(`${appRoot}/winston`);
const express = require('express');
const router = express.Router();
const fs = require('fs');

// loop through bots to append API
fs.readdir(`${appRoot}/bots`, function (err, folders) {
    if (err) {
        winston.debug("Could not list the directory.", err);
    }
    folders.forEach(function (folder, index) {
        try {
            winston.debug(`Current folder: ${appRoot}/bots/${folder}/post`);
            router.post('/api/'+folder, require(`${appRoot}/bots/${folder}/post/index`));
            winston.debug('added /api/'+folder);
        }
        catch (e) {
            winston.debug('unable to add /api/'+folder);
            winston.debug(e);
        }
    });
});

module.exports = router;
