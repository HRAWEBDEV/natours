import { join } from 'path';
import { readFileSync } from 'fs';
import { Tour } from '../models/tourModel.js';
import { connectDb } from './connect.js';
import dotenv from 'dotenv';
dotenv.config();
const insertData = async () => {
    const toursFilePath = join(process.cwd(), 'dev-data', 'data', 'tours.json');
    const tours = JSON.parse(readFileSync(toursFilePath, 'utf-8'));
    try {
        await connectDb();
        // Tour.deleteMany();
        await Tour.insertMany(tours);
        console.log('data inserted successfully');
    }
    catch (err) {
        console.log(err);
    }
    process.exit(0);
};
const deleteData = async () => {
    try {
        await connectDb();
        // Tour.deleteMany();
        await Tour.deleteMany();
        console.log('data deleted successfully');
    }
    catch (err) {
        console.log(err);
    }
    process.exit(0);
};
if (process.argv[2] === '--import') {
    insertData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}
//# sourceMappingURL=populateDb.js.map