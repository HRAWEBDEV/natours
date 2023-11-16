import { join } from 'path';
import { readFileSync } from 'fs';
import { Tour } from '../models/tourModel.js';
import { connectDb } from './connect.js';
import dotenv from 'dotenv';
dotenv.config();

const toursFilePath = join(process.cwd(), 'dev-data', 'data', 'tours.json');
const tours = JSON.parse(readFileSync(toursFilePath, 'utf-8'));

const insertData = async () => {
  await connectDb();
  // Tour.deleteMany();
  await Tour.insertMany(tours);
  process.exit(0);
};

insertData();
