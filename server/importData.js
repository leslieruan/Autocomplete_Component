const fs = require('fs').promises;
const path = require('path');
const { connectToDatabase, client } = require('./db');

// Clean data function
function cleanData(data) {
    return data.map(item => {
        const cleanItem = {};
        for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'string') {
                // clean string       
                cleanItem[key] = value.replace(/[\n\t]/g, ' ').trim(); 
            } else if (Array.isArray(value)) {
                cleanItem[key] = cleanData(value);
            } else if (typeof value === 'object' && value !== null) {
                cleanItem[key] = cleanData([value])[0];
            } else {
                cleanItem[key] = value;
            }
        }
        return cleanItem;
    });
}

// Preprocess JSON function
function preprocessJson(rawData) {
    return rawData.trim();
}

async function importData() {
    try {
        const rawData = await fs.readFile(
            path.join(__dirname, './data.json'),
            'utf8'
        );

        const safeData = preprocessJson(rawData);
        
        
        let jsonData = JSON.parse(safeData);

        const cleanedData = cleanData(jsonData);

        const db = await connectToDatabase();
        const collection = db.collection('artists');
        await collection.deleteMany({});

        const result = await collection.insertMany(cleanedData);
        console.log(`Successfully imported ${result.insertedCount} documents`);

        const importedCount = await collection.countDocuments();
        console.log(`Total documents in collection: ${importedCount}`);

        return { success: true, count: result.insertedCount };
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    } finally {
        await client.close();
    }
}

// Import data
importData()
    .then(result => {
        console.log('Import completed:', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('Import failed:', error);
        process.exit(1);
    });
