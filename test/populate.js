const ChangingStationIds = [];
const CPIds = [];
const ConnectorIds = [];
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
  return response.body['_id'];
};
const populate = async () => {
  const response1 = await request(app).post('/ChargingStation').send({
    stationName: 'Dexon',
    address: {
      road: 'BC-12',
      pinCode: '576111',
      district: 'Udupi',
      location: {
        type: 'Point',
        coordinates: [9.9, 89.90],
      },
    },
  });
  const response2 = await request(app).post('/ChargingStation').send({
    stationName: 'Rapper Cars',
    address: {
      district: 'Udupi',
      road: 'BC-12',
      pinCode: '576111',
      location: {
        type: 'Point',
        coordinates: [10.2, 84.90],
      },
    },
  });

  ChangingStationIds.push(response1.body['_id'], response2.body['_id']);

  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], true));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], true));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[0], false));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[1], true));

  ConnectorIds.push(await createNewConnector(CPIds[0], '120', 'A2', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[0], '120', 'A3', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[0], '240', 'A2', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[1], '240', 'A2', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[1], '240', 'A1', false, 'GH'));
  ConnectorIds.push(await createNewConnector(CPIds[1], '120', 'A2', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[2], '360', 'A3', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[2], '360', 'A3', true, 'GH'));
  ConnectorIds.push(await createNewConnector(CPIds[2], '120', 'A2', false, 'GH'));
  ConnectorIds.push(await createNewConnector(CPIds[3], '240', 'A3', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[3], '120', 'A2', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[3], '240', 'A2', true, 'SE2'));
  CPIds.push(await createNewChargingPoint(ChangingStationIds[1], true));
  ConnectorIds.push(await createNewConnector(CPIds[4], '360', 'A1', true, 'SE2'));
  ConnectorIds.push(await createNewConnector(CPIds[4], '360', 'A1', true, 'SE2'));
  return {
    ChargingPointIds: CPIds,
    ChangingStationIds: ChangingStationIds,
    ConnectorIds: ConnectorIds,
  };
};

module.exports = {populate};
