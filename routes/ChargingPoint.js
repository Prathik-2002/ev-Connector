const express = require('express');
const chargingPointRoutes = express.Router();
const {createNewChargingPoint, isValidId} = require('../index');

chargingPointRoutes.post('/', async (req, res) => {
  const isValidChargingStation = await isValidId('ChargingStation', req.body.chargingStationId);
  if (isValidChargingStation) {
    const ack = await createNewChargingPoint(req.body);
    res.status(201).json(ack);
  } else {
    res.status(400).json({message: 'Invalid Charging Station'});
  }
});

module.exports = chargingPointRoutes;
