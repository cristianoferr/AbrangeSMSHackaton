const resourcesPath = process.env.npm_package_config_resourcesPath;
const servePort = process.env.npm_package_config_servePort;
const rootPath = "../frontend/";
global.projectName = process.env.npm_package_name;

const express = require('express');
var app = express();
const routes = require('./routes/routes');
const cors = require('cors');
const logger = require('./util/logger');
const bodyParser = require('body-parser');

app.use(cors());
app.use(
    bodyParser.urlencoded({
        parameterLimit: 10000,
        limit: '2mb',
        extended: true
    })
);
app.use(bodyParser.json({ limit: '2mb' }));

//app.use(bodyParser.json({ limit: '2mb' }));
app.use('/', express.static(rootPath));
app.use('/resources', express.static(resourcesPath));

const server = require('http').createServer(app);
app.use('/api/', routes);

//mensagem de erro
app.use(function (err, req, res, next) {
    res.status(err.code || 500).json({
        status: 'error',
        message: err
    });
});

//loga as saidas
app.use(function (req, res, next) {
    logger.winston.info(`${req.method} ${req.url}`);
    next();
});

//The 404 Route (ALWAYS Keep this as the last route)
app.use(function(req, res, next) {
    res.status(404).end('error');
});
  

const listener = server.listen(servePort);

checkServer();


function checkServer() {
    logger.winston.info(
        'Servidor Rodando em: http://localhost:' + listener.address().port
    );
}