const express = require('express');
const app = express();
const PORT = 3000;
let isDatabaseConnected = false;
function setIsDatabaseConnected(connection) {
  isDatabaseConnected = connection;
}
const {
  createNewChargingStation,
  createNewChargingPoint,
  createNewConnector,
  getConnectorsByPinCode,
  getConnectorsByGeoLocation,
  connectToMongoDB,
  disconnectMongoDB} = require('../index');

const establishConnection = async (URI) => {
  connectToMongoDB(URI)
      .then((value) => setIsDatabaseConnected(true));
};
const removeConnection = async () => {
  disconnectMongoDB().then((value) => setIsDatabaseConnected(false));
};
app.use(express.json());

app.use((req, res, next ) => {
  if (isDatabaseConnected) {
    next();
  } else {
    res.status(503).send('Database not connected');
  }
});

app.get('/Connector/pinCode', async (req, res) => {
  const pinCode = req.query.pinCode;
  const connectors = await getConnectorsByPinCode(pinCode);
  res.status(200).json(connectors);
});
app.get('/Connector/GeoLocation', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const distance = req.query.distance | 100;
  const Connectors = await getConnectorsByGeoLocation(latitude, longitude, distance);
  res.status(200).json(Connectors);
});
app.post('/ChargingStation', async (req, res) => {
  const ack = await createNewChargingStation(req.body);
  res.json(ack);
});
app.post('/ChargingPoint', async (req, res) => {
  const ack = await createNewChargingPoint(req.body);
  res.json(ack);
});
app.post('/Connector', async (req, res) => {
  const ack = await createNewConnector(req.body);
  res.json(ack);
});
establishConnection('mongodb://localhost/EV2');
const server = app.listen(PORT);
const closeServer = () => {
  server.close();
};
module.exports = {app, establishConnection, removeConnection, closeServer};
