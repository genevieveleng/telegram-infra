const appRoot = require('app-root-path');
const fs = require('fs');
const https = require('https');
const express = require('express');
const winston = require(`${appRoot}/winston`);
const router = require(`${appRoot}/router`);

const privateKey  = fs.readFileSync(`${appRoot}/secrets/server.key`, 'utf8');
const certificate = fs.readFileSync(`${appRoot}/secrets/server_public.pem`, 'utf8');
const credentials = {key: privateKey, cert: certificate};
winston.info("Starting Server");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(router);
const httpsServer = https.createServer(credentials, app);

httpsServer.listen('443', () => {
    winston.info('Port in use (443)');
});
