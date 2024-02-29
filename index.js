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
  await ChargingPoint.findByIdAndUpdate(connectorData.chargingPointId,
      {$push: {connectors: newConnector.id}});
  await updateDataOnConnector(newConnector.id, 'chargingStation', chargingStationId);
  await updateDataOnConnector(newConnector.id, 'chargingPoint', connectorData.chargingPointId);
  const updatedConnector = await Connector.findById(newConnector.id);
  return updatedConnector;
};
const createNewChargingPoint = async (chargingPointData) => {
  const newChargingPoint = await ChargingPoint.create(chargingPointData);
  await ChargingStation.findByIdAndUpdate(chargingPointData.chargingStationId,
      {$push: {chargingPoints: newChargingPoint.id}});
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
const findStationIdFromChargingPointId = async (chargingPointId) => {
  const station = await ChargingStation.findOne({chargingPoints: {$in: chargingPointId}});
  return station.id;
};


module.exports = {
  createNewConnector,
  createNewChargingPoint,
  createNewChargingStation,
  connectToMongoDB,
  disconnectMongoDB,
};

