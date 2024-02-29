const {ChargingPointTestParameters} = require('./test-ChargingPoint');
const {ChargingStationTestParameters} = require('./test-ChargingStation');
const ConnectorTestCase = [
  {
    type: 'A2',
    manufacturer: 'Jap',
    wattage: '123',
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['id'],
    chargingPointId: ChargingPointTestParameters.testcase[0]['id'],
  },
  {
    type: 'A2',
    manufacturer: 'Jap',
    wattage: '123',
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['id'],
    chargingPointId: ChargingPointTestParameters.testcase[0]['id'],
  },
];

const ConnectorTestParameters = {
  type: 'POST',
  route: '/Connector',
  testcase: ConnectorTestCase,
};

module.exports = {ConnectorTestParameters};
