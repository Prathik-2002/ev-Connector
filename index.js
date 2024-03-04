const {Connector, ChargingPoint, ChargingStation} = require('./Schema');
const mongoose = require('mongoose');
const isValidId = async (modelname, id) => {
  const selectedModel = mongoose.model(modelname);
  const isExisting = await selectedModel.findById(id);
  if (isExisting == null) {
    return false;
  }
  return true;
};
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
  // returns updated connector
  const updatedConnector = await Connector.findById(newConnector.id);
  return updatedConnector;
};

const createNewChargingPoint = async (chargingPointData) => {
  const newChargingPoint = await ChargingPoint.create(chargingPointData);
  // push new chaarging point to charging station
  await ChargingStation.findByIdAndUpdate(chargingPointData.chargingStationId,
      {$push: {chargingPoints: newChargingPoint.id}});
  await updateDataOfChargingStationOnAllConnectors(chargingPointData.chargingStationId);
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
  const AllConnectors = await Connector.find({'chargingStation._id': chargingStationId}, {_id: 1});
  AllConnectors.forEach(async (connector) => {
    await updateDataOnConnector(connector.id, 'chargingStation', chargingStationId);
  });
};
const findStationIdFromChargingPointId = async (chargingPointId) => {
  const station = await ChargingStation.findOne({chargingPoints: {$in: chargingPointId}});
  return station.id;
};

const getConnectorsByGeoLocation = async (lat, lng, distance = 10000) => {
  const connectors = await Connector.find({
    'chargingStation.address.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lat, lng],
        },
        $maxDistance: distance},
    },
    'isWorking': true,
    'isBusy': false,
    'chargingPoint.isWorking': true,
  });
  return connectors;
};

const updateConnector = async (id, isBusy) => {
  await Connector.findByIdAndUpdate(id, {$set: {'isBusy': isBusy}});
  const updatedConnector = await Connector.findById(id);
  return {isBusy: updatedConnector.isWorking};
};
module.exports = {
  createNewConnector,
  createNewChargingPoint,
  createNewChargingStation,
  updateConnector,
  isValidId,
  connectToMongoDB,
  getConnectorsByGeoLocation,
  disconnectMongoDB,
};

