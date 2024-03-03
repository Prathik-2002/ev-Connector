const {expect} = require('chai');
const {app} = require('../server/server');
const request = require('supertest');
const {getNewChargingPoint} = require('./test-ChargingPoint');
const {ChargingStation, ChargingPoint} = require('../Schema');
const ConnectorPayload = {
  type: 'A2',
  manufacturer: 'Jap',
  wattage: '123',
  isWorking: true,
};

const getNewConnector = async (stationPayload, chargingPointPayload, payload) => {
  const ChargingingPointResponseWithStationId = await getNewChargingPoint(
      stationPayload,
      chargingPointPayload);
  const ChargingPointId = ChargingingPointResponseWithStationId
      .chargingPoint
      .body['_id']
      .toString();
  payload['chargingPointId'] = ChargingPointId;
  const response = await request(app)
      .post('/Connector')
      .send(payload)
      .set('Accept', 'application/json');
  return {
    chargingPointId: ChargingPointId,
    stationId: ChargingingPointResponseWithStationId.stationId,
    connectorResponse: response,
  };
};
const testCreateConnector = (isSubset) => {
  it('should create a connector with status code 201', async ()=>{
    const response = await getNewConnector({
      stationName: 'Station 3',
      address: {
        district: 'Jammu',
        pinCode: '567465',
        road: 'BC-12',
        location: {
          coordinates: [-21.99, 89.90],
          type: 'Point',
        },
      },
    },
    {
      isWorking: true,
      connectors: [],
    },
    ConnectorPayload);
    const StationDetails = await ChargingStation.findById(response.stationId).lean();
    const chargingPointDetails = await ChargingPoint.findById(response.chargingPointId).lean();
    ConnectorPayload['chargingStation'] = StationDetails;
    ConnectorPayload['chargingPoint'] = chargingPointDetails;
    delete ConnectorPayload.chargingPointId;
    expect(response.connectorResponse.headers['content-type']).match(/json/);
    expect(response.connectorResponse.status).equal(201);
    expect(isSubset(response.connectorResponse.body, ConnectorPayload)).to.be.true;
  });
};

module.exports = {testCreateConnector};
