
class ENV {
  constructor() {
    this.PORT = process.env.PORT;
    this.ESTIMATE_CHARGING_TIME_URL = process.env.ESTIMATE_CHARGING_TIME_URL;
    this.DATABASE_URI = process.env.DATABASE_URI;
  }
  setPort(port) {
    process.env.PORT = port;
  }
  setDatabaseURI(databaseURI) {
    process.env.DATABASE_URI = databaseURI;
  }
  setEstimateServerUrl(url) {
    process.env.ESTIMATE_CHARGING_TIME_URL = url;
  }
}

const Env = new ENV();
module.exports = {Env};
