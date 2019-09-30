const fs = require('fs');

let rawdata = fs.readFileSync(__dirname + '/../../dados/dados.json');
let dados = JSON.parse(rawdata);

function getData(name) {
    return dados[name];
}

module.exports = {
    getData
}