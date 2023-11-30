import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDb } from './db/connect.js';
import { router as tourRouter } from './routes/tourRoute.js';
import { replaceQueryOperator } from './middlewares/replaceQueryOperators.js';
import { notFound } from './middlewares/notFound.js';

dotenv.config();
const app = express();
// add default middlewares
process.env.MODE && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// * query replacer
app.use(replaceQueryOperator);
// * routes
const apiBaseRoute = '/api/v1';
app.use(`${apiBaseRoute}/tour`, tourRouter);

// * attach not found
app.all('*', notFound);

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
