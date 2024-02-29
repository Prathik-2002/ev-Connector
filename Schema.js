const mongoose=require('mongoose');
const AddressSchema = new mongoose.Schema({
  road: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  landmark: {
    type: String,
    // required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});
const ChargingStationSchema = new mongoose.Schema({
  chargingPoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingPoints',
  }],
  stationName: {
    type: String,
    required: true,
  },
  address: {
    type: AddressSchema,
    required: true,
  },
  openTime: {
    type: Date,
    // required: true,
  },
  closeTime: {
    type: Date,
    // reqired: true,
  },
  busyStatus: {
    type: String,
    // required: true,
  },
  upiPayment: {
    type: Boolean,
    // required: true,
  },
});
const ChargingPointSchema = new mongoose.Schema({
  connectors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connector',
  }],
  isWorking: {
    type: Boolean,
    required: true,
  },
});
const ConnectorSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  wattage: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  chargingPoint: {
    type: ChargingPointSchema,
  },
  chargingStation: {
    type: ChargingStationSchema,
  },
  isWorking: {
    type: Boolean,
    required: true,
  },
  isBusy: {
    type: Boolean,
    // required: true,
  },
});

const Connector = mongoose.model('Connector', ConnectorSchema);
const ChargingPoint = mongoose.model('ChargingPoint', ChargingPointSchema);
const ChargingStation = mongoose.model('ChargingStation', ChargingStationSchema);
module.exports = {Connector, ChargingPoint, ChargingStation};
