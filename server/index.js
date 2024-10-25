const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://leslieruan8:xQiG66x7zSUyGk3T@musicfindercluster.bmb5h.mongodb.net/?retryWrites=true&w=majority&appName=MusicFinderCluster&tls=true";


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
      tls: true
    }
  });

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas!");
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        await client.close();
    }
}

run().catch(console.dir);
