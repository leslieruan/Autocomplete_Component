
const fs = require('fs').promises;
const path = require('path');
const { connectToDatabase, client } = require('./db');



// pre-clean data
function preprocessJson(rawData) {

    let processedData = rawData
        .replace(/\\n/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\s+/g, ' ') 
        .trim();
    processedData = processedData.replace(/(?<!\\)"/g, '\\"');
    
    if ((processedData.match(/"/g) || []).length % 2 !== 0) {
        console.error("Mismatched quotes detected in JSON data.");
        throw new Error("Invalid JSON format: Mismatched quotes");
    }


    // console.log("Processed Data Preview:", processedData.slice(0, 5000));

    try {
        JSON.parse(processedData);
    } catch (error) {
        console.error("Invalid JSON data:", processedData.slice(0, 500)); 
        throw new Error("Invalid JSON format");
    }
    return processedData;


}
// clean string
function cleanStr(str) {
    if (typeof str !== 'string') {
        return str;
    }

    str = str.replace(/\\n/g, ' ')
        .replace(/\\t/g, ' ')

    str = str.replace(/(?<!\\)"/g, '\\"'); 
    return str.replace(/\s+/g, ' ').trim();
}
// clean data 
function cleanData(data) {
    return data.map(item => {
        const cleanItem = {};
        for (const [key, value] of Object.entries(item)) {
            if (typeof value === 'string') {
                cleanItem[key] = cleanStr(value);
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

async function importData() {
    try {
        const rawData = await fs.readFile(
            path.join(__dirname, './data.json'),
            'utf8'
        );
        // console.log("Raw Data Preview:", rawData.slice(0, 1000));
        const safeData = preprocessJson(rawData);
        let jsonData = JSON.parse(safeData);

        // console.log("Safe Data Preview:", safeData);

        const cleanedData = cleanData(jsonData);

        // const cleanedData = cleanData(jsonData);

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

// import data
importData()
    .then(result => {
        console.log('Import completed:', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('Import failed:', error);
        process.exit(1);
    });