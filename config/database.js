require("dotenv").config();
const mongo = require("mongodb");

const database = {
  connect: async () => {
    const { MONGODB_CONNECTION_STRING } = process.env;

    try {
      const client = new mongo.MongoClient(MONGODB_CONNECTION_STRING);
      return await client.connect();
    } catch (error) {
      throw error;
    }
  },
  getConnectionPool: async () => {
    return await database.connect();
  },
  getDb: async (dbName) => {
    const client = await database.getConnectionPool();
    return client.db(dbName);
  },
};

module.exports = { database };
