const {app, establishConnection, removeConnection, closeServer} = require('../server/server');
const {testCreateChargingStation} = require('./test-ChargingStation');
const {testCreateChargingPoint} = require('./test-ChargingPoint');
const {testCreateConnector} = require('./test-Connector');
const {MongoMemoryServer} = require('mongodb-memory-server');
const request = require('supertest');
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
    await establishConnection(URI);
  });
  testCreateChargingStation(isSubset);
  testCreateChargingPoint(isSubset);
  testCreateConnector(isSubset);
  after(async ()=>{
    await removeConnection();
    await mongoServer.stop();
    closeServer();
  });
});
const endpoints = {
  post: ['/Connector', '/ChargingStation', '/ChargingPoint'],
  get: ['/Connector/pinCode', '/Connector/GeoLocation'],
};
describe('Test without Database Connection', () => {
  endpoints.post.forEach((postendpoint) => {
    it(`should return status 503 for endpoint ${postendpoint}`, async ()=>{
      await request(app)
          .post(postendpoint)
          .expect(503);
    });
  });
  endpoints.get.forEach((getendpoint) => {
    it(`should return status 503 for endpoint ${getendpoint}`, async ()=>{
      await request(app)
          .get(getendpoint)
          .expect(503);
    });
  });
});
