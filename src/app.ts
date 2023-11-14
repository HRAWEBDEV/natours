import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDb } from './db/connect.js';

dotenv.config();
const app = express();
// add default middlewares
process.env.MODE && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

const serverPort = process.env.PORT;
const startServer = async () => {
  try {
    await connectDb();
    app.listen(serverPort, () => {
      console.log(`server is listening to port: ${serverPort}`);
    });
  } catch (err) {
    console.log(`server failed to start:${err}`);
  }
};

startServer();
