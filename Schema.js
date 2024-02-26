const mongoose=require('mongoose');

const ConnectorSchema = new mongoose.Schema({
    Type: {
      type: String,
      required: true,
    },
    Wattage: {
      type: String,
      required: true,
    },
    Manufacturer: {
      type: String,
      required: true,
    },
  });
  const ChargingPointSchema = new mongoose.Schema({
    Connectors: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Connector',
    }],
  });
  const ChargingStationSchema = new mongoose.Schema({
    ChargingPoints: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'ChargingPoint',
    }],
    Address: {
      type: String,
      required: true,
    },
  });
  