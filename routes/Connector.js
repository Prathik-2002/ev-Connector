const express = require('express');
const connectorRoutes = express.Router();
const {
  createNewConnector,
  getConnectorsByPinCode,
  getConnectorsByGeoLocation,
} = require('../index');

connectorRoutes.get('/pinCode', async (req, res) => {
  const pinCode = req.query.pinCode;
  const connectors = await getConnectorsByPinCode(pinCode);
  res.status(200).json(connectors);
});
connectorRoutes.get('/GeoLocation', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const distance = req.query.distance;
  const Connectors = await getConnectorsByGeoLocation(latitude, longitude, distance);
  res.status(200).json(Connectors);
});
connectorRoutes.post('/', async (req, res) => {
  const ack = await createNewConnector(req.body);
  res.status(201)
      .json(ack);
});

module.exports = connectorRoutes;
