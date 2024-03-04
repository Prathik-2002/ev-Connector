const request = require('supertest');
const {expect} = require('chai');
const {app} = require('../server/server');
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
      stationName: 'Station 2',
      address: {
        road: 'BC-12',
        district: 'Jammu',
        location: {
          type: 'Point',
          coordinates: [-21.99, 89.90],
        },
        pinCode: '567465',
      },
    }, payload);
    expect(response.chargingPoint.status).equal(201);
    expect(response.chargingPoint.headers['content-type']).match(/json/);
    expect(isSubset(response.chargingPoint.body, payload)).to.be.true;
  });
  it('should return 400 with message Invalid Charging Point for invalid id', async () => {
    const PayloadCopy = {...payload};
    PayloadCopy['chargingStationId'] = '65de9af8416ddf00765d39dc';
    const response = await request(app)
        .post('/ChargingPoint')
        .send(PayloadCopy);
    expect(response.status).equal(400);
    expect(response.body.message).equal('Invalid Charging Station');
  });
};

module.exports = {testCreateChargingPoint, getNewChargingPoint};
