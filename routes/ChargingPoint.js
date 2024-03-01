const express = require('express');
const chargingPointRoutes = express.Router();
const {createNewChargingPoint} = require('../index');

chargingPointRoutes.post('/', async (req, res) => {
  const ack = await createNewChargingPoint(req.body);
  res.status(201).json(ack);
});

module.exports = chargingPointRoutes;
