const express = require('express');
const connectorRoutes = express.Router();
const {
  createNewConnector,
  getConnectorsByGeoLocation,
} = require('../index');

connectorRoutes.post('/', async (req, res) => {
  const ack = await createNewConnector(req.body);
  res.status(201).json(ack);
});


connectorRoutes.get('/', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const distance = req.query.distance;
  const Connectors = await getConnectorsByGeoLocation(latitude, longitude, distance);
  res.status(200).json(Connectors);
});
// connectorRoutes.patch('/')


module.exports = connectorRoutes;
