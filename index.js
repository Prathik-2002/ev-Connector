const {Connector, ChargingPoint, ChargingStation} = require('./Schema');
const mongoose = require('mongoose');
const dropMongoDatabase = async () => {
  await mongoose.connection.db.dropDatabase();
};
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
  await updateDataOnConnector(newConnector.id, 'ChargingStation', chargingStationId);
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
  const selectedModel = mongoose.model(property);
  const propertyData = await selectedModel.findById(propertyId);
  const propertyNameInConnector = property[0].toLowerCase() + property.slice(1);
  const UpdateObj = {};
  UpdateObj[propertyNameInConnector] = propertyData;
  const updatedConnector = await Connector.findByIdAndUpdate(connectorId, UpdateObj);
  return updatedConnector;
};
const updateDataOfChargingPointOnAllConnectors = async (chargingPointId) => {
  const chargingPoint = await ChargingPoint.findById(chargingPointId);
  chargingPoint.connectors.forEach(async (connector) => {
    await updateDataOnConnector(connector, 'ChargingPoint', chargingPointId);
  });
};
const updateDataOfChargingStationOnAllConnectors = async (chargingStationId) => {
  const AllConnectors = await Connector.find({'chargingStation._id': chargingStationId});
  AllConnectors.forEach(async (connector) => {
    await updateDataOnConnector(connector.id, 'ChargingStation', chargingStationId);
  });
};
const findStationIdFromChargingPointId = async (chargingPointId) => {
  const station = await ChargingStation.findOne({chargingPoints: {$in: chargingPointId}});
  return station.id;
};
const getConnectorsByGeoLocation = async (lat, lng, type, distance = 10000) => {
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
    'type': type,
  });
  return connectors;
};
const getConnectorById = async (connectorId) => {
  const connector = await Connector.findById(connectorId).lean();
  return connector;
};
const updateConnector = async (id, isBusy) => {
  await Connector.findByIdAndUpdate(id, {$set: isBusy});
  const updatedConnector = await Connector.findById(id);
  return {isBusy: updatedConnector.isBusy};
};
module.exports = {
  createNewConnector,
  createNewChargingPoint,
  createNewChargingStation,
  updateConnector,
  getConnectorById,
  isValidId,
  connectToMongoDB,
  dropMongoDatabase,
  getConnectorsByGeoLocation,
  disconnectMongoDB,
};

