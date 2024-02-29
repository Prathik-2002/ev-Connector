const {Connector, ChargingPoint, ChargingStation} = require('./Schema');
const mongoose = require('mongoose');

const connectToMongoDB = async (URI) => {
  await mongoose.connect(URI);
};
const disconnectMongoDB = async (URI) => {
  await mongoose.disconnect();
};
const createNewConnector = async (connectorData) => {
  const chargingStationData = await ChargingStation.findById(connectorData.chargingStationId);
  const chargingPointData = await ChargingPoint.findById(connectorData.chargingPointId);
  const chargoingPointId = connectorData.chargingPointId;
  delete connectorData.chargingStationId;
  delete connectorData.chargingPointId;
  connectorData.chargingPoint = chargingPointData;
  connectorData.chargingStation = chargingStationData;
  const newConnector = await Connector.create(connectorData);
  await ChargingPoint
      .findById(chargoingPointId)
      .updateOne({}, {$push: {connectors: newConnector.id}});
  return newConnector;
};
const createNewChargingPoint = async (chargingPointData) => {
  const newChargingPoint = await ChargingPoint.create(chargingPointData);
  const newChargingPointId = newChargingPoint.id;
  await ChargingStation
      .findById(chargingPointData.chargingStationId)
      .updateOne({}, {$push: {chargingPoints: newChargingPointId}});
  return newChargingPoint;
};
const createNewChargingStation = async (ChargingStationData) => {
  const newChargingStation = await ChargingStation.create(ChargingStationData);
  return newChargingStation;
};

module.exports = {
  createNewConnector,
  createNewChargingPoint,
  createNewChargingStation,
  connectToMongoDB,
  disconnectMongoDB,
};

