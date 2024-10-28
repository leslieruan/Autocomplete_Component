const express = require('express');
const cors = require('cors');
const { connectToDatabase, client } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/artists', async (req, res) => {
  try {
      const db = await connectToDatabase();
      const collection = db.collection('artists');
      const artists = await collection.find().toArray();  
      res.json(artists);
  } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

