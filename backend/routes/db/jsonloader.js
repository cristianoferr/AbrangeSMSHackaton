const fs = require('fs');

let rawdata = fs.readFileSync(__dirname + '/../../dados/dados.json');
let dados = JSON.parse(rawdata);

//Função genérica que retorna os dados
function getData(name) {
    return dados[name];
}

function updateData(name, newData) {
    dados[name] = newData;
}

module.exports = {
    getData,
    updateData
}