const {expect} = require('chai');
const {app, establishConnection, removeConnection, closeServer} = require('../server/server');
const {ChargingStationTestParameters} = require('./test-ChargingStation');
const {ChargingPointTestParameters} = require('./test-ChargingPoint');
const {ConnectorTestParameters} = require('./test-Connector');
const {MongoMemoryServer} = require('mongodb-memory-server');
const request = require('supertest');
let mongoServer;

const isSubset = (superObj, subObj) => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == 'object') {
      return isSubset(superObj[ele], subObj[ele]);
    }
    return subObj[ele] === superObj[ele];
  });
};

const assertOnConnection = (response, testcase) => {
  expect(response.header['content-type']).match(/json/);
  expect(response.status).equal(200);
  expect(isSubset(response.body, testcase)).to.be.true;
  testcase['_id'] = response.body['_id'];
};
const assertOnNoConnection = (response) => {
  expect(response.status).equal(503);
  expect(response.header['content-type']).match(/text/);
  expect(response.text).equal('Database not connected');
};

const testDesign = (parameter, connectionStatus, assertParameter) => {
  describe(`${parameter.type} ${parameter.route}`, () => {
    parameter.testcase.forEach((testcase)=>{
      const expectedStatusCode = connectionStatus?200: 503;

      it(`should ${connectionStatus?'':'not'} create a record 
      StatusCode-${expectedStatusCode}`, async ()=> {
        const response = await request(app)
            .post(parameter.route)
            .send(testcase);
        assertParameter(response, testcase);
      });
    });
  });
};

describe('Test with Database Connection', ()=>{
  before(async ()=>{
    mongoServer = await MongoMemoryServer.create();
    const URI = await mongoServer.getUri();
    await establishConnection(URI);
  });

  testDesign(ChargingStationTestParameters, true, assertOnConnection);
  testDesign(ChargingPointTestParameters, true, assertOnConnection);
  // testDesign(ConnectorTestParameters, true, assertOnConnection);

  after(async ()=>{
    await removeConnection();
    await mongoServer.stop();
    closeServer();
  });
});
describe('Test without Database Connection', ()=>{
  testDesign(ChargingStationTestParameters, false, assertOnNoConnection);
  testDesign(ChargingPointTestParameters, false, assertOnNoConnection);
  testDesign(ConnectorTestParameters, false, assertOnNoConnection);
});
