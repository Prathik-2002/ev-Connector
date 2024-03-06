const {expect} = require('chai');
const {app} = require('../server/server');
const request = require('supertest');
const {getNewChargingPoint} = require('./test-ChargingPoint');
const {ChargingStation, ChargingPoint} = require('../Schema');
const {populateLight} = require('./populate');
const ConnectorPayload = {
  type: 'A2',
  manufacturer: 'Jap',
  wattage: '123',
  isWorking: true,
  isBusy: false,
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
  it('should create a connector with status code 201 for valid input', async ()=>{
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
  it('should return 400 with message Invalid Charging Point for invalid id', async () => {
    const ConnectorPayloadCopy = {...ConnectorPayload};
    ConnectorPayloadCopy['chargingPointId'] = '65de9af8416ddf00765d39dc';
    const response = await request(app)
        .post('/Connector')
        .send(ConnectorPayloadCopy);
    expect(response.status).equal(400);
    expect(response.body.message).equal('Invalid Charging Point');
  });
};
const testGetConnectorById = (BCapacity, SoC, status, estimateData, isSubset) => {
  it(`should return the connector details with status code ${status}`, async ()=>{
    const connector = await populateLight();
    const getConnectorResponse = await request(app)
        .get(`/Connector/${connector['_id']}?batteryCapacity=${BCapacity}&SoC=${SoC}`);
    expect(isSubset(getConnectorResponse.body, connector)).to.be.true;
    expect(getConnectorResponse.status).equal(status);
    expect(getConnectorResponse.body.estimatedChargingTime).equal(estimateData);
  });
  it('should return status 404 for invalid Id', async () => {
    const getConnectorResponse = await request(app).get('/Connector/65e6b0c65c719e67feeecdee');
    expect(getConnectorResponse.status).equal(404);
    expect(getConnectorResponse.body.message).equal('Invalid Connector');
  });
};
module.exports = {testCreateConnector, testGetConnectorById};
