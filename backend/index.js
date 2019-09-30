var http = require('http');
var fs = require('fs');
var path = require('path');
var rootPath = '../frontend/app';
var sapPath = "G:/sap/resources/openui5-runtime-1.60.19";

var server=http.createServer(function (request, response) {
    var filePath = "";
    //tratamento para acessar resources do openui
    if (request.url.startsWith("/resources")) {
        filePath = sapPath + request.url;
    } else {
        filePath = rootPath + request.url;
    }
    console.log(`request.url:${request.url} - filePath:${filePath}`)
    if (filePath == rootPath + "/")
        filePath = rootPath + '/index.html';


    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

});

server.listen(8080);
console.log('Servidor rodando em  http://127.0.0.1:8080/');