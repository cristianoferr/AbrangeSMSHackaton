const express = require('express');
const router = express.Router();
const jsonloader = require('./db/jsonloader');

const sample = require('./sample/sample');

router.get('/estados', sample.getEstados);

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
