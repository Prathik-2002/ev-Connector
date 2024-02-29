const {ChargingPointTestParameters} = require('./test-ChargingPoint');
const {ChargingStationTestParameters} = require('./test-ChargingStation');
const ConnectorTestCase = [
  {
    type: 'A2',
    manufacturer: 'Jap',
    wattage: '123',
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['_id'],
    chargingPointId: ChargingPointTestParameters.testcase[0]['_id'],
  },
  {
    type: 'A2',
    manufacturer: 'Jap',
    wattage: '123',
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['_id'],
    chargingPointId: ChargingPointTestParameters.testcase[0]['_id'],
  },
];

const ConnectorTestParameters = {
  type: 'POST',
  route: '/Connector',
  testcase: ConnectorTestCase,
};

module.exports = {ConnectorTestParameters};
