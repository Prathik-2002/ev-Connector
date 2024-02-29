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
    },
    coordinates: {
      type: [Number],
    },
  },
});
const ChargingStationSchema = new mongoose.Schema({
  stationName: String,
  address: AddressSchema,
  openTime: String,
  closeTime: String,
  busyStatus: String,
  facilities: [String],
});
const ChargingPointSchema = new mongoose.Schema({
  chargingStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingStation',
  },
  isWorking: Boolean,
});
const ConnectorSchema = new mongoose.Schema({
  type: String,
  wattage: String,
  manufacturer: String,
  chargingStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingStation',
  },
  chargingPointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChargingPoint',
  },
  isWorking: Boolean,
  isBusy: Boolean,
});

const Connector = mongoose.model('Connector', ConnectorSchema);
const ChargingPoint = mongoose.model('ChargingPoint', ChargingPointSchema);
const ChargingStation = mongoose.model('ChargingStation', ChargingStationSchema);
module.exports = {Connector, ChargingPoint, ChargingStation};
