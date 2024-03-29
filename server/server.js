const express = require('express');
const connectorRoutes = require('../routes/Connector');
const chargingPointRoutes = require('../routes/ChargingPoint');
const chargingStationRoutes = require('../routes/ChargingStation');
const {connectToMongoDB, disconnectMongoDB, dropMongoDatabase} = require('../index');

let isDatabaseConnected = false;
let server;

const app = express();

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
const connectToDatabase = async () => {
  const MONGO_DB_URI = process.env.DATABASE_URI;
  connectToMongoDB(MONGO_DB_URI)
      .then(() => {
        setIsDatabaseConnected(true);
        console.log('Connected to database to URI', MONGO_DB_URI);
      });
};
const removeConnection = async () => {
  disconnectMongoDB().then(() => setIsDatabaseConnected(false));
};
const dropDatabase = async () => {
  await dropMongoDatabase();
};
const startServer = () => {
  const PORT = process.env.PORT;
  server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
};
const closeServer = () => {
  server.close();
};
module.exports = {app, startServer, connectToDatabase, removeConnection, closeServer, dropDatabase};
