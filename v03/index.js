import express from 'express';
import { ParseServer } from 'parse-server';
import http from 'http';

const app = express();

const server = new ParseServer({
    databaseURI: 'mongodb://localhost:27017/dev',
    cloud: './cloud/main.js',
    appId: 'myAppId',
    masterKey: 'myMasterKey',
    fileKey: 'optionalFileKey',
    serverURL: 'http://localhost:1337/parse'
});

await server.start();

app.use('/parse', server.app);

app.get('/', function (req, res) {
    res.status(200).send(`readysign-server est en cours d'exécution !!!`);
});

const httpServer = http.createServer(app);
httpServer.keepAliveTimeout = 100000;   // 100s
httpServer.headersTimeout = 100000;     // 100s

httpServer.listen(1337, '0.0.0.0', function () {
    console.log('readysign-server est exécuté sur le port 1337.');
});
