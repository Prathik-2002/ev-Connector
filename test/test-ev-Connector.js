const {expect} = require('chai');
const request = require('supertest');
const {Env} = require('./config');
const {MongoMemoryServer} = require('mongodb-memory-server');
const nock = require('nock');


let mongoServer;
const getMongoMemoryServer = async () => {
  return MongoMemoryServer.create().then((mongoMemoryServer) => {
    mongoServer = mongoMemoryServer;
    return mongoMemoryServer.getUri();
  });
};
const {app,
  startServer,
  connectToDatabase,
  removeConnection,
  closeServer,
  dropDatabase,
} = require('../server/server');

let connector;
const mockEstimateURL = 'http://api-mock-esti44mate.com';
Env.setPort(5050);
Env.setEstimateServerUrl(mockEstimateURL);

const {testCreateChargingStation} = require('./test-ChargingStation');
const {testCreateChargingPoint} = require('./test-ChargingPoint');
const {testCreateConnector, testGetConnectorById} = require('./test-Connector');
const {populateHeavy, populateLight} = require('./populate');


const isSubset = (superObj, subObj) => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == 'object') {
      return isSubset(superObj[ele], subObj[ele]);
    }
    return (subObj[ele]) === (superObj[ele]);
  });
};

describe('Test with Database Connection', ()=>{
  before( async ()=>{
    await getMongoMemoryServer().then((uri) => {
      Env.setDatabaseURI(uri);
    });
    startServer();
    await connectToDatabase();
  });
  describe('GET /Connector', async () => {
    it(`should return 3 connectors for lat: 9.9, lng: 89.9 and type "A2"`, async () => {
      const Ids = await populateHeavy();
      const ConnectorIds = Ids.ConnectorIds;
      const currentLocation = {lat: 9.9, lng: 89.90};
      const getResponse = await request(app)
          .get('/Connector')
          .query(currentLocation).query({type: 'A2'});
      const expectedIds = [
        ConnectorIds[0],
        ConnectorIds[2],
        ConnectorIds[4]];
      getResponse.body.forEach((connector) => {
        expect(expectedIds.includes(connector['_id'])).to.be.true;
      });
      expect(getResponse.body.length).equal(expectedIds.length);
    });
  });
  describe('GET /Connector/:id', ()=> {
    const testCases = {
      InvalidTestCase: {
        batteryCapacity: 120,
        SoC: -50,
        connectorPower: 240,
        estimateServerResponseStatus: 404,
        getConnectorByIdResponseStatus: 206,
        estimateServerResponseData: 'Not Available',
      },
      ValidTestCase: {
        batteryCapacity: 120,
        SoC: 50,
        connectorPower: 240,
        estimateServerResponseStatus: 200,
        getConnectorByIdResponseStatus: 200,
        estimateServerResponseData: 15,
      },
    };
    Object.keys(testCases).forEach((testcase) => {
      describe(`with ${testCases[testcase]
          .estimateServerResponseStatus} status from estimate server`, () => {
        before(()=>{
          nock(mockEstimateURL).get('/ChargingTime')
              .query({
                batteryCapacity: testCases[testcase].batteryCapacity,
                SoC: testCases[testcase].SoC,
                connectorPower: testCases[testcase].connectorPower})
              .reply(
                  testCases[testcase].estimateServerResponseStatus,
                  {estimatedChargingTimeInMin: testCases[testcase].estimateServerResponseData},
              );
        });
        testGetConnectorById(
            testCases[testcase].batteryCapacity,
            testCases[testcase].SoC,
            testCases[testcase].getConnectorByIdResponseStatus,
            testCases[testcase].estimateServerResponseData,
            isSubset);
      });
    });
  });
  describe('PATCH /Connector', () => {
    before(async () => {
      connector = await populateLight();
    });
    it('should change isBusy to true', async () => {
      const patchResponse = await request(app).patch(`/Connector/${connector['_id']}`).query({
        'isBusy': true,
      });
      expect(patchResponse.body.isBusy).to.be.true;
    });
    it('should change isBusy to false', async () => {
      const patchResponse = await request(app).patch(`/Connector/${connector['_id']}`).query({
        isBusy: false,
      });
      expect(patchResponse.body.isBusy).to.be.false;
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
      await dropDatabase();
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
  get: ['/Connector', '/Connector/65e6b0c65c719e67feeecdee'],
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
