const {Connector, ChargingPoint, ChargingStation} = require('./Schema');
const mongoose = require('mongoose');

const connectToMongoDB = async (URI) => {
  await mongoose.connect(URI);
};
const disconnectMongoDB = async (URI) => {
  await mongoose.disconnect();
};
const createNewConnector = async (connectorData) => {
  const newConnector = await Connector.create(connectorData);
  const chargingStationId = await findStationIdFromChargingPointId(connectorData.chargingPointId);
  // push the new connector to charging point
  await ChargingPoint.findByIdAndUpdate(connectorData.chargingPointId,
      {$push: {connectors: newConnector.id}});
  // add ChargingStation and ChargingPoint details to Connector
  await updateDataOfChargingPointOnAllConnectors(connectorData.chargingPointId);
  await updateDataOnConnector(newConnector.id, 'chargingStation', chargingStationId);
  // return updated connector
  const updatedConnector = await Connector.findById(newConnector.id);
  return updatedConnector;
};

const createNewChargingPoint = async (chargingPointData) => {
  const newChargingPoint = await ChargingPoint.create(chargingPointData);
  // push new chaarging point to charging station
  await ChargingStation.findByIdAndUpdate(chargingPointData.chargingStationId,
      {$push: {chargingPoints: newChargingPoint.id}});
  await updateDataOfChargingStationOnAllConnectors(chargingPointData.chargingStationI);
  return newChargingPoint;
};
const createNewChargingStation = async (ChargingStationData) => {
  const newChargingStation = await ChargingStation.create(ChargingStationData);
  return newChargingStation;
};
const updateDataOnConnector = async (connectorId, property, propertyId) => {
  let propertyData;
  if (property == 'chargingStation') {
    propertyData = await ChargingStation.findById(propertyId);
  } if (property == 'chargingPoint') {
    propertyData = await ChargingPoint.findById(propertyId);
  }
  const UpdateObj = {};
  UpdateObj[property] = propertyData;
  const updatedConnector = await Connector.findByIdAndUpdate(connectorId, UpdateObj);
  return updatedConnector;
};
const updateDataOfChargingPointOnAllConnectors = async (chargingPointId) => {
  const chargingPoint = await ChargingPoint.findById(chargingPointId);
  chargingPoint.connectors.forEach(async (connector) => {
    await updateDataOnConnector(connector, 'chargingPoint', chargingPointId);
  });
};
const updateDataOfChargingStationOnAllConnectors = async (chargingStationId) => {
  const AllConnectors = await Connector.find({chargingStation: chargingStationId}, {_id: 1});
  AllConnectors.forEach(async (connector) => {
    await updateDataOnConnector(connector.id, 'chargingStation', chargingStationId);
  });
};
const findStationIdFromChargingPointId = async (chargingPointId) => {
  const station = await ChargingStation.findOne({chargingPoints: {$in: chargingPointId}});
  return station.id;
};

const getConnectorsByPinCode = async (pinCode) => {
  const connectors = await Connector.find({'chargingStation.address.pinCode': pinCode});
  return connectors;
};
const getConnectorsByGeoLocation = async (lat, lng, radius) => {
  const connectors = await Connector.find({'chargingStation.address.location': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lat, lng],
      },
      $maxDistance: radius}}});
  return connectors;
};

module.exports = {
  createNewConnector,
  createNewChargingPoint,
  createNewChargingStation,
  getConnectorsByPinCode,
  connectToMongoDB,
  getConnectorsByGeoLocation,
  disconnectMongoDB,
};

