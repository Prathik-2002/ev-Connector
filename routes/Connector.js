const express = require('express');
const connectorRoutes = express.Router();
const {isValidId} = require('../index');
const {
  createNewConnector,
  getConnectorsByGeoLocation,
  updateConnector,
} = require('../index');

connectorRoutes.post('/', async (req, res) => {
  const isValidChargingPoint = await isValidId('ChargingPoint', req.body.chargingPointId);
  if (isValidChargingPoint) {
    const ConnectorAck = await createNewConnector(req.body);
    res.status(201).json(ConnectorAck);
  } else {
    res.status(400).json({message: 'Invalid Charging Point'});
  }
});

connectorRoutes.get('/', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const distance = req.query.distance;
  const Connectors = await getConnectorsByGeoLocation(latitude, longitude, distance);
  res.status(200).json(Connectors);
});
connectorRoutes.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const update = req.body;
  const isValidConnectorId = await isValidId('Connector', id);
  if (isValidConnectorId) {
    await updateConnector(id, update.isBusy);
    res.status(202).json({isBusy: update.isBusy});
  } else {
    res.status(400).json({message: 'Invalid Connector'});
  }
});


module.exports = connectorRoutes;
