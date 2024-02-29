const express = require('express');
const chargingStationRoutes = express.Router();
const {createNewChargingStation} = require('../index');


chargingStationRoutes.post('/', async (req, res) => {
  const ack = await createNewChargingStation(req.body);
  res.json(ack);
});

module.exports = chargingStationRoutes;

