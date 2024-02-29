const express = require('express');
const chargingPointRoutes = express.Router();
const {createNewChargingPoint} = require('../index');

chargingPointRoutes.post('/', async (req, res) => {
  const ack = await createNewChargingPoint(req.body);
  res.json(ack);
});

module.exports = chargingPointRoutes;
