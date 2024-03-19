const fs = require('fs');


class Database{
  constructor(name, path){
    this.name = name;
    this.path = path;
    this.db = null;
  };

  // Connect to the database
  async connectDatabase(){}
  // Close the database connection
  async closeDatabase(){}
}

class LocalDatabase extends Database{
  constructor(name, path){
    super(name, path);
  }

  async connectDatabase(){
    try {
      console.log('Connecting to local database ' + this.name + '...');
      if(fs.existsSync(this.path)){
        console.log('Local database ' + this.name + ' exists...');
      }else{
        throw new Error('Local database ' + this.name + ' does not exist...');
      }
    } catch (error) {
      console.error('Failed to connect to local database ' + this.name + '...');
      console.error(error);
    }
  }

  async loadDatabase() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.data = JSON.parse(data.toString());
      console.log('Local database ' + this.name + ' loaded...');
    } catch (error) {
      console.error('Failed to load local database ' + this.name + '...');
      console.error(error);
    }
  }

  async saveDatabase(){
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.data));
      console.log('Local database ' + this.name + ' saved...');
    } catch (error) {
      console.error('Failed to save local database ' + this.name + '...');
      console.error(error);
    }
  }

  async closeDatabase(){
    // TODO...
  }

  insertData(key, value){
    if(!!this.data[key]) return;
    this.data[key] = value;

    this.saveDatabase();
  }

  getData(key){
    return this.data[key];
  }

  updateData(key, value){
    if(!this.data[key]) return;
    this.data[key] = value;
    
    this.saveDatabase();
  }

  deleteData(key){
    delete this.data[key];
  }
}

module.exports = {
  LocalDatabase
}