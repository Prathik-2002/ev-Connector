const request = require('supertest');
const {app} = require('../server/server');

const createNewChargingPoint = async (chargingStationId, isWorking) => {
  const response = await request(app).post('/ChargingPoint').send({
    isWorking: isWorking,
    chargingStationId: chargingStationId,
  });
  return response.body['_id'];
};
const createNewConnector = async (CPointId, wattage, type, isWorking, manufacturer) => {
  const response = await request(app).post('/Connector').send({
    isWorking: isWorking,
    wattage: wattage,
    type: type,
    isBusy: false,
    chargingPointId: CPointId,
    manufacturer: manufacturer,
  });
  return response.body;
};
const createNewChargingStation = async (Name, road, pinCode, district, lat, lng) => {
  const response = await request(app).post('/ChargingStation').send({
    stationName: Name,
    address: {
      road: road,
      pinCode: pinCode,
      district: district,
      location: {
        type: 'Point',
        coordinates: [lat, lng],
      },
    },
  });
  return response.body['_id'];
};
const populateHeavy = async () => {
  const ChangingStationIds = [];
  const CPIds = [];
  const ConnectorIds = [];

  ChangingStationIds
      .push(await createNewChargingStation('Dexon', 'BC-12', '576111', 'Udupi', 9.9, 89.90));
  ChangingStationIds
      .push(await createNewChargingStation('Rapper Cars', 'BC-12', '576101', 'Udupi', 10.2, 84.90));

  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], true));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], true));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], false));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[1], true));

  ConnectorIds.push((await createNewConnector(CPIds[0], '120', 'A2', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[0], '240', 'A1', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[1], '240', 'A2', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[1], '240', 'A1', false, 'GH'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[1], '120', 'A2', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[0], '120', 'A3', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[2], '360', 'A3', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[2], '360', 'A3', true, 'GH'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[2], '120', 'A2', false, 'GH'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[3], '240', 'A3', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[3], '120', 'A2', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[3], '240', 'A2', true, 'SE2'))['_id']);
  CPIds.push(await createNewChargingPoint(ChangingStationIds[1], true));
  ConnectorIds.push((await createNewConnector(CPIds[4], '360', 'A1', true, 'SE2'))['_id']);
  ConnectorIds.push((await createNewConnector(CPIds[4], '360', 'A1', true, 'SE2'))['_id']);
  return {
    ChargingPointIds: CPIds,
    ChangingStationIds: ChangingStationIds,
    ConnectorIds: ConnectorIds,
  };
};
const populateLight = async () => {
  const chargingStationId = await createNewChargingStation(
      'Dexon', 'BC-12', '576111', 'Udupi', 9.9, 89.90);
  const chargingPointId = await createNewChargingPoint(chargingStationId, true);
  const connector = await createNewConnector(chargingPointId, '240', 'A2', true, 'SE2');
  return connector;
};

module.exports = {populateHeavy, populateLight};
