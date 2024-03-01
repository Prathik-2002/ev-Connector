const {expect} = require('chai');
const {app} = require('../server/server');
const request = require('supertest');
const {getNewStation} = require('./test-ChargingStation');
const payload = {
  isWorking: true,
  connectors: [],
};
const getNewChargingPoint = async (stationpayload, payload) => {
  const NewStation = await getNewStation(stationpayload);
  const StationId = NewStation.body['_id'];
  payload['chargingStationId'] = StationId;
  const response = await request(app)
      .post('/ChargingPoint')
      .send(payload)
      .set('Accept', 'application/json');
  delete payload.chargingStationId;
  const returnObj = {stationId: StationId, chargingPoint: response};
  return returnObj;
};
const testCreateChargingPoint = (isSubset) => {
  it('should create a ChargingPoint with status code 201', async ()=>{
    const response = await getNewChargingPoint({
      stationName: 'ABB TEch',
      address: {
        road: 'BC-12',
        pinCode: '567465',
        district: 'Jammu',
        location: {
          type: 'Point',
          coordinates: [-21.99, 89.90],
        },
      },
    }, payload);
    expect(response.chargingPoint.status).equal(201);
    expect(response.chargingPoint.headers['content-type']).match(/json/);
    expect(isSubset(response.chargingPoint.body, payload)).to.be.true;
  });
};

module.exports = {testCreateChargingPoint, getNewChargingPoint};
