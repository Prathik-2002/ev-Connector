const express = require('express');
const {createNewChargingStation} = require('../index');
const chargingStationRoutes = express.Router();

chargingStationRoutes.post('/', async (req, res) => {
  const response = await createNewChargingStation(req.body);
  res.status(201).json(response);
});
module.exports = chargingStationRoutes;

