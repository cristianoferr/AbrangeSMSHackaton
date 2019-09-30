const fs = require('fs');


function getData(name) {
    let rawdata = fs.readFileSync(__dirname + '/../../dados/dados.json');
    let dados = JSON.parse(rawdata);
    return dados[name];
}

module.exports = {
    getData
}