//const db = require('../db');
const jsonloader = require('../db/jsonloader');
const logger = require('../../util/logger');

//Exemplo de retorno fazendo uma consulta em banco de dados
function getConsultaBancoDeDados(req, res, next) {
  logger.winston.info('sample.getConsultaBancoDeDados');
  const registroId = Number(req.params.registroId);
  db.any('select * from tabela where agent_id = $1 order by action_id', registroId)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

//exemplo de consulta fazendo uma consulta direto no json
function getEstados(req, res, next) {
  logger.winston.info('sample.getEstados');
  res.status(200).json(jsonloader.getData("estados"));
}

function getEstado(req, res, next) {
  logger.winston.info('sample.getEstado');
  const sigla = req.params.sigla;
  let estado = jsonloader.getData("estados").find(x => x.sigla == sigla)
  if (estado) {
    res.status(200).json(estado);
  } else {
    return next("Estado não encontrado");
  }
}


function updateEstado(req, res, next) {
  logger.winston.info('sample.updateEstado');
  const sigla = req.params.sigla;
  let nome = req.body.nome;
  let estados = jsonloader.getData("estados");
  let estado = estados.find(x => x.sigla == sigla)
  if (estado && nome) {
    estado.nome = nome;
    jsonloader.updateData("estados", estados);
    res.status(200).json({
      status: 'success',
      message: 'Estado Atualizado'
    });
  } else {
    return next("Erro ao atualizar Estado!");
  }
}

function removeEstado(req, res, next) {
  logger.winston.info('sample.removeEstado');
  const sigla = req.params.sigla;
  try {
  let estados = jsonloader.getData("estados");
  estados = estados.filter(x => x.sigla != sigla);
  jsonloader.updateData("estados", estados);
  res.status(200).json({
    status: 'success',
    message: 'Estado Removido'
  });
} catch (err) {
  logger.winston.info('erro em removeEstado: ' + err);
  return next(err);
}
}

function createEstado(req, res, next) {
  logger.winston.info('sample.createEstado');
  let sigla = req.body.sigla;
  let nome = req.body.nome;
  let estados = jsonloader.getData("estados");
  if (!estados.find(x => x.sigla == sigla)) {
    estados.push({ sigla: sigla.toUpperCase(), nome: nome });
    jsonloader.updateData("estados", estados);
    res.status(200).json({
      status: 'success',
      message: 'Estado Includo'
    });

  } else {
    return next("Estado já existe");
  }
}



module.exports = {
  getConsultaBancoDeDados,
  getEstados,
  getEstado,
  updateEstado,
  removeEstado,
  createEstado
};
