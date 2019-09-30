//const db = require('../db');
const jsonloader = require('../db/jsonloader');
const logger = require('../../util/logger');

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

  function getEstados(req, res, next) {
    logger.winston.info('sample.getEstados');
    res.status(200).json(jsonloader.getData("estados"));
  }


  module.exports = {
    getConsultaBancoDeDados,
    getEstados
  };
  