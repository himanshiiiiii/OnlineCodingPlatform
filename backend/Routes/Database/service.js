const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
class DataBase {
  constructor() {
    this.db_url = process.env.DB_URL;
    this.db_name = process.env.DB_NAME;
    this.db_con;
    console.log("in database consturctor of service.js");
    setImmediate(async () => {
      this.db_con = await this.createConnection();
    });
  }
  createConnection = () => {
    return new Promise((resolve, reject) => {
      try {
        mongoose.connect(this.db_url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('Database connected successfully');
      } catch (error) {
        console.error('Error while creating connection:', error);
      }
    });
  };
}

const database = new DataBase();
exports.db_con = database;
