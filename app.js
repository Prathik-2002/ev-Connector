const {startServer, connectToDatabase} = require('./server/server');

const startApp = async () => {
  startServer();
  await connectToDatabase();
};
startApp();

