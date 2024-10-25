const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI 

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      tls: true
    }
  });

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB Atlas');
        const db = client.db('musicDB');
        return db;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        throw error;
    }
}

module.exports = { connectToDatabase, client };