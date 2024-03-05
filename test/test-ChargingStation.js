const {expect} = require('chai');
const request = require('supertest');
const {app} = require('../server/server');
const payload = {
  stationName: 'Station 1',
  address: {
    road: 'BC-12',
    pinCode: '567465',
    district: 'Jammu',
    location: {
      type: 'Point',
      coordinates: [-21.99, 89.90],
    },
  },
};
const getNewStation = async (payload) => {
  const response = await request(app)
      .post('/ChargingStation')
      .send(payload)
      .set('Accept', 'application/json');
  return response;
};
const testCreateChargingStation = (isSubset) => {
  it('should create a station with status code 201 for valid input', async ()=>{
    const response = await getNewStation(payload);
    expect(response.headers['content-type']).match(/json/);
    expect(response.status).equal(201);
    expect(isSubset(response.body, payload)).to.be.true;
  });
};


module.exports = {testCreateChargingStation, getNewStation};
