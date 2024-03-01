const express = require('express');
const connectorRoutes = require('../routes/Connector');
const chargingPointRoutes = require('../routes/ChargingPoint');
const chargingStationRoutes = require('../routes/ChargingStation');
const {
  connectToMongoDB,
  disconnectMongoDB,
} = require('../index');

const app = express();
const PORT = 3000;
let isDatabaseConnected = false;

app.use(express.json());

app.use((req, res, next ) => {
  if (isDatabaseConnected) {
    next();
  } else {
    res.status(503).send('Database not connected');
  }
});

app.use('/Connector', connectorRoutes);
app.use('/ChargingPoint', chargingPointRoutes);
app.use('/ChargingStation', chargingStationRoutes);

const setIsDatabaseConnected = (connection) => {
  isDatabaseConnected = connection;
};

const establishConnection = async (URI) => {
  connectToMongoDB(URI)
      .then((value) => setIsDatabaseConnected(true));
};
const removeConnection = async () => {
  disconnectMongoDB().then((value) => setIsDatabaseConnected(false));
};


const server = app.listen(PORT);
const closeServer = () => {
  server.close();
};
module.exports = {app, establishConnection, removeConnection, closeServer};
