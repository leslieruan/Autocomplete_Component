const { MongoClient, ServerApiVersion } = require('mongodb');
// Load environment variables from a .env file
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
/**
 * Connects to the MongoDB database and returns the database instance.
 *
 * @async
 * @function connectToDatabase
 * @returns {Promise<Object>} The database instance
 * @throws {Error} Throws an error if the connection fails
 */
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas');
    const db = client.db('MusicDB');
    return db;
  } catch (error) {
    console.error('Connection to MongoDB Atlas failed!', error);
    throw error;
  }
}
module.exports = { connectToDatabase, client };