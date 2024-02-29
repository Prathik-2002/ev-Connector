const mongoose=require('mongoose');
const AddressSchema = new mongoose.Schema({
  road: String,
  state: String,
  landmark: String,
  pinCode: String,
  district: String,
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
  stationName: String,
  address: AddressSchema,
  openTime: String,
  closeTime: String,
  busyStatus: String,
  upiPayment: Boolean,
});
const ChargingPointSchema = new mongoose.Schema({
  chargingStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingStation',
  },
  connectors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connector',
  }],
  isWorking: Boolean,
});
const ConnectorSchema = new mongoose.Schema({
  type: String,
  wattage: String,
  manufacturer: String,
  chargingPoint: ChargingPointSchema,
  chargingStation: ChargingStationSchema,
  isWorking: Boolean,
  isBusy: Boolean,
});

const Connector = mongoose.model('Connector', ConnectorSchema);
const ChargingPoint = mongoose.model('ChargingPoint', ChargingPointSchema);
const ChargingStation = mongoose.model('ChargingStation', ChargingStationSchema);
module.exports = {Connector, ChargingPoint, ChargingStation};
