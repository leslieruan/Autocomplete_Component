const fs = require('fs').promises;
const path = require('path');
const { connectToDatabase, client } = require('./db');

// Clean data function
/**
 * Cleans the input data by removing unwanted characters and formatting.
 *
 * @param {Array<Object>} data - The array of data items to clean
 * @returns {Array<Object>} The cleaned data items
 */
function cleanData(data) {
    return data.map(item => {
        const cleanItem = {};
        for (const [key, value] of Object.entries(item)) {
            if (key === '_id' && value) {
                cleanItem[key] = value;
            } else if (typeof value === 'string') {
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
/**
 * Preprocesses raw JSON data by trimming whitespace.
 *
 * @param {string} rawData - The raw JSON data to preprocess
 * @returns {string} The trimmed JSON data
 */
function preprocessJson(rawData) {
    return rawData.trim();
}
// Import data function
/**
 * Imports data from a JSON file into the MongoDB database.
 *
 * @async
 * @function importData
 * @returns {Promise<Object>} Result object containing success status and count
 * @throws {Error} Throws an error if data import fails
 */
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
