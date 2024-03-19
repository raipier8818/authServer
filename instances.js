const { LocalDatabase } = require("./modules/database");

const localAccountDBPath = __dirname + '/' + process.env.LOCAL_DB_PATH + '/account.json';
const localAccountDBName = 'localAccountDB';
const localAccountDB = new LocalDatabase(localAccountDBName, localAccountDBPath);

const localSessionDBPath = __dirname + '/' + process.env.LOCAL_DB_PATH + '/session.json';
const localSessionDBName = 'localSessionDB';
const localSessionDB = new LocalDatabase(localSessionDBName, localSessionDBPath);

const run = async (options) => {
  localAccountDB.connectDatabase();
  localAccountDB.loadDatabase();
  
  localSessionDB.connectDatabase();
  localSessionDB.loadDatabase();
}


module.exports = {
  localAccountDB,
  localSessionDB,
  run
}