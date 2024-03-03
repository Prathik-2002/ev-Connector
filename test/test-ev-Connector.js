const {expect} = require('chai');
const {app, establishConnection, removeConnection, closeServer} = require('../server/server');
const {testCreateChargingStation} = require('./test-ChargingStation');
const {testCreateChargingPoint} = require('./test-ChargingPoint');
const {testCreateConnector} = require('./test-Connector');
const {MongoMemoryServer} = require('mongodb-memory-server');
const request = require('supertest');
const {populate} = require('./populate');
const mongoose = require('mongoose');
let mongoServer;
let Ids;
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
  describe('GET request', async () => {
    it(`should return 5 connectors for lat: 9.9, lng: 89.9, distance: 1000`, async () => {
      Ids = await populate();
      const ConnectorIds = Ids.ConnectorIds;
      const getResponse = await request(app)
          .get('/Connector')
          .query({lat: 9.9, lng: 89.90, distance: 1000});
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
