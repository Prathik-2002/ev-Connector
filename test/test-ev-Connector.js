const {expect} = require('chai');
const {app, establishConnection, removeConnection, closeServer} = require('../server/server');
const {testCreateChargingStation} = require('./test-ChargingStation');
const {testCreateChargingPoint} = require('./test-ChargingPoint');
const {testCreateConnector} = require('./test-Connector');
const {MongoMemoryServer} = require('mongodb-memory-server');
const request = require('supertest');
const {populateHeavy, populateLight} = require('./populate');
const mongoose = require('mongoose');
let mongoServer;
const isSubset = (superObj, subObj) => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == 'object') {
      return isSubset(superObj[ele], subObj[ele]);
    }
    return (subObj[ele]) === (superObj[ele]);
  });
};

describe('Test with Database Connection', ()=>{
  before(async ()=>{
    mongoServer = await MongoMemoryServer.create();
    const URI = mongoServer.getUri();
    establishConnection(URI);
  });
  describe('GET /Connector', async () => {
    it(`should return 5 connectors for lat: 9.9, lng: 89.9`, async () => {
      const Ids = await populateHeavy();
      const ConnectorIds = Ids.ConnectorIds;
      const currentLocation = {lat: 9.9, lng: 89.90};
      const getResponse = await request(app)
          .get('/Connector')
          .query(currentLocation);
      const expectedIds = [
        ConnectorIds[0],
        ConnectorIds[1],
        ConnectorIds[2],
        ConnectorIds[3],
        ConnectorIds[5]];
      getResponse.body.forEach((connector) => {
        expect(expectedIds.includes(connector['_id'])).to.be.true;
      });
      expect(getResponse.body.length).equal(5);
    });
  });


  let connectorId;
  describe('PATCH /Connector', () => {
    before(async () => {
      connectorId = await populateLight();
    });
    it('should change isBusy to true', async () => {
      const patchResponse = await request(app).patch(`/Connector/${connectorId}`).send({
        'isBusy': true,
      });
      expect(patchResponse.body.isBusy).to.be.true;
    });

    it('should status 400 for invalid connector id', async () => {
      const patchResponse = await request(app).patch(`/Connector/65de9af8416ddf00765d39dc`).send({
        'isBusy': false,
      });
      expect(patchResponse.status).equal(400);
      expect(patchResponse.body.message).equal('Invalid Connector');
    });
  });

  describe('POST request', ()=>{
    afterEach(async () => {
      mongoose.connection.db.dropDatabase();
    });
    testCreateChargingPoint(isSubset);
    testCreateChargingStation(isSubset);
    testCreateConnector(isSubset);
  });

  after(async ()=>{
    await removeConnection();
    await mongoServer.stop();
    closeServer();
  });
});


const endpoints = {
  post: ['/Connector', '/ChargingStation', '/ChargingPoint'],
  get: ['/Connector'],
};
describe('Test without Database Connection', () => {
  endpoints.post.forEach((postendpoint) => {
    it(`should return status 503 for endpoint POST ${postendpoint}`, async ()=>{
      await request(app)
          .post(postendpoint)
          .expect(503);
    });
  });
  endpoints.get.forEach((getendpoint) => {
    it(`should return status 503 for endpoint GET ${getendpoint}`, async ()=>{
      await request(app)
          .get(getendpoint)
          .expect(503);
    });
  });
});
