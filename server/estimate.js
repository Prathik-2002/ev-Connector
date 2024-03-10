const axios = require('axios');

const estimateChargingTime = async (batteryCapacity, SoC, connectorWattage) => {
  try {
    const estimateServerURL = process.env.ESTIMATE_CHARGING_TIME_URL;
    const response = await axios
        .get(`${estimateServerURL}/ChargingTime`, {
          params: {batteryCapacity: batteryCapacity, SoC: SoC, connectorPower: connectorWattage}});
    return {
      status: response.status,
      estimatedChargingTimeInMin: response.data.estimatedChargingTimeInMin,
    };
  } catch (er) {
    return {
      status: 206,
      estimatedChargingTimeInMin: 'Not Available',
    };
  }
};

module.exports = {estimateChargingTime};
