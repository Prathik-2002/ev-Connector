const axios = require('axios');
const estimateUrl = 'http://localhost:5050';
// 'https://api.estimate-mock.com';

const estimateChargingTime = async (batteryCapacity, SoC, connectorWattage) => {
  try {
    const response = await axios
        .get(`${estimateUrl}/ChargingTime`, {
          params: {batteryCapacity: batteryCapacity, SoC: SoC, connectorPower: connectorWattage}});
    return {
      status: response.status,
      estimatedChargingTime: response.data.estimatedChargingTime,
    };
  } catch (er) {
    return {
      status: 206,
      estimatedChargingTime: 'Not Available',
    };
  }
};

module.exports = {estimateChargingTime};
