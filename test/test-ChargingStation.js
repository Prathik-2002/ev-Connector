const ChargingStationsTestCase = [
  {
    stationName: 'ABB TEch',
    address: {
      road: 'BC-12',
      pinCode: '567465',
      district: 'Jammu',
      location: {
        type: 'Point',
        coordinates: [-21.99, 89.90],
      },
    },
  },
  {
    stationName: 'car GEEEk',
    address: {
      road: 'BC-13',
      pinCode: '5732008',
      district: 'Kasmir',
      location: {
        type: 'Point',
        coordinates: [-21.4, 91.90],
      },
    },
  },
];

const ChargingStationTestParameters = {
  type: 'POST',
  route: '/ChargingStation',
  testcase: ChargingStationsTestCase,

};


module.exports = {ChargingStationTestParameters};
