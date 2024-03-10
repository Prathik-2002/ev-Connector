const express = require('express');
const connectorRoutes = express.Router();
const {estimateChargingTime} = require('../server/estimate');
const {isValidId} = require('../index');
const {
  createNewConnector,
  getConnectorsByGeoLocationAndType,
  updateConnector,
  getConnectorById,
} = require('../index');

connectorRoutes.post('/', async (req, res) => {
  const isValidChargingPoint = await isValidId('ChargingPoint', req.body.chargingPointId);
  if (isValidChargingPoint) {
    const newConnectorAck = await createNewConnector(req.body);
    res.status(201).json(newConnectorAck);
  } else {
    res.status(400).json({message: 'Invalid Charging Point'});
  }
});

connectorRoutes.get('/:id', async (req, res) => {
  const batteryCapacity = req.query.batteryCapacity;
  const SoC = req.query.SoC;
  const connectorId = req.params.id;
  if (await isValidId('Connector', connectorId)) {
    const connector = await getConnectorById(connectorId);
    const connectorWattage = connector.wattage;
    const ChargingTimeResponse = await estimateChargingTime(
        batteryCapacity,
        SoC,
        connectorWattage,
    );
    connector['estimatedChargingTimeInMin'] = ChargingTimeResponse.estimatedChargingTimeInMin;
    res.status(ChargingTimeResponse.status).json(connector);
  } else {
    res.status(404).json({message: `Invalid Connector`});
  }
});

connectorRoutes.get('/', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const distance = req.query.distance;
  const type = req.query.type;
  const Connectors = await getConnectorsByGeoLocationAndType(latitude, longitude, type, distance);
  res.status(200).json(Connectors);
});

connectorRoutes.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const update = req.query.isBusy;
  const isValidConnectorId = await isValidId('Connector', id);
  if (isValidConnectorId) {
    const updatedIsBusy = await updateConnector(id, {isBusy: update});
    res.status(202).json(updatedIsBusy);
  } else {
    res.status(400).json({message: 'Invalid Connector'});
  }
});


module.exports = connectorRoutes;
