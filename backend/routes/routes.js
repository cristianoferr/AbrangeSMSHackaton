const express = require('express');
const router = express.Router();
const jsonloader = require('./db/jsonloader');

const sample = require('./sample/sample');

router.get('/Estados', sample.getEstados);
router.get('/Estados/:id', sample.getEstado);
router.put('/Estados/:id', sample.updateEstado);
router.delete('/Estados/:id', sample.removeEstado);
router.post('/Estados', sample.createEstado);

//Exemplos:
//const agents = require('../db/agents');
//router.get('/agents', agents.getAllAgents);
//router.get('/agents/:agent_id', agents.getSingleAgent);
/**
 router.get('/actions/:action_id', actions.getSingleAction);
router.put('/actions/:action_id', actions.updateAction);
router.delete('/actions/:action_id', actions.removeAction);
router.post('/actions', actions.createAgentAction);
router.get('/agents/:agent_id/actions', actions.getAgentActions);
 */


module.exports = router;
