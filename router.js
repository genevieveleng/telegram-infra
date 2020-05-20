const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();
const fs = require('fs');

// loop through bots to append API
fs.readdir(`${appRoot}/bots`, function (err, folders) {
    if (err) {
        console.error("Could not list the directory.", err);
    }
    folders.forEach(function (folder, index) {
        try {
            console.log(`${appRoot}/bots/${folder}/post`);
            router.post('/api/'+folder, require(`${appRoot}/bots/${folder}/post/index`));
            console.log('added /api/'+folder);
        }
        catch (e) {
            console.log('unable to add /api/'+folder);
            console.log(e);
        }
    });
});

module.exports = router;
