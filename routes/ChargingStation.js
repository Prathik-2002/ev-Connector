const express = require('express');
const {createNewChargingStation} = require('../index');
const chargingStationRoutes = express.Router();

chargingStationRoutes.post('/', async (req, res) => {
  const ack = await createNewChargingStation(req.body);
  res.status(201).json(ack);
});
module.exports = chargingStationRoutes;

