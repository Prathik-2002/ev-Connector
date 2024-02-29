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
const server = app.listen(PORT);
const closeServer = () => {
  server.close();
};
module.exports = {app, establishConnection, removeConnection, closeServer};
