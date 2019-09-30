const fs = require('fs');

let rawdata = fs.readFileSync(__dirname + '/../../dados/dados.json');
let dados = JSON.parse(rawdata);

//armazena o sequence de cada entidade
let sequence = {};
updateIndices();


/**
 * atualiza os ids únicos dos registros
 */
function updateIndices() {
    for (var nomePropriedade in dados) {
        updateIndice(nomePropriedade);
    }
}

function updateIndice(nomePropriedade) {
    let array = dados[nomePropriedade];
    if (!sequence[nomePropriedade]) {
        sequence[nomePropriedade] = 0;
    }
    array.forEach((x) => {
        if (!x.id) {
            x.id = ++sequence[nomePropriedade];
        }
    })
}

//Função genérica que retorna os dados
function getData(name) {
    return dados[name];
}

function updateData(name, newData) {
    dados[name] = newData;
    updateIndices();
}

module.exports = {
    getData,
    updateData
}