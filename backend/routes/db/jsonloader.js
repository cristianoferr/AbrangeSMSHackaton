const fs = require('fs');

let store = {};

carrega("dados");
carrega("instalacoes");
carrega("orgaos");

function carrega(arquivo) {
    let rawdata = fs.readFileSync(__dirname + '/../../dados/' + arquivo + '.json');
    let dados = JSON.parse(rawdata);
    store[arquivos] = dados;
}

//armazena o sequence de cada entidade
let sequence = {};

//atualizo todos os indices
for (var nomePropriedade in store) {
    updateIndices(nomePropriedade);
}

/**
 * atualiza os ids únicos dos registros
 */
function updateIndices(dados) {
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
function getData(storeName, name) {
    return store[storeName][name];
}

function updateData(storeName, name, newData) {
    store[storeName][name] = newData;
    updateIndices();
}

module.exports = {
    getData,
    updateData
}