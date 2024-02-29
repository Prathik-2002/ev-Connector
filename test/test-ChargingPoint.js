const {ChargingStationTestParameters} = require('./test-ChargingStation');
const ChargingPointsTestCase = [
  {
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['_id'],
  },
  {
    isWorking: true,
    chargingStationId: ChargingStationTestParameters.testcase[0]['_id'],
  },
];

const ChargingPointTestParameters = {
  type: 'POST',
  route: '/ChargingPoint',
  testcase: ChargingPointsTestCase,
};

module.exports = {ChargingPointTestParameters};
