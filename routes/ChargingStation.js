const express = require('express');
const {createNewChargingStation} = require('../index');
const chargingStationRoutes = express.Router();

chargingStationRoutes.post('/', async (req, res) => {
  const ack = await createNewChargingStation(req.body);
  res.status(201).json(ack);
});
chargingStationRoutes.get('/', async (req, res) => {
  res.status(500).json({message: 'notavailable'});
});
module.exports = chargingStationRoutes;

