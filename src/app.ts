import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDb } from './db/connect.js';
import { router as tourRouter } from './routes/tourRoute.js';
import { router as userRouter } from './routes/userRoute.js';
import { replaceQueryOperator } from './middlewares/replaceQueryOperators.js';
import { notFound } from './middlewares/notFound.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { IncomingMessage, Server, ServerResponse } from 'http';

// * add uncaught exception handler
process.on('uncaughtException', (err: Error) => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  process.exit(1);
});

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
// * tours route
app.use(`${apiBaseRoute}/tour`, tourRouter);
app.use(`${apiBaseRoute}/user`, userRouter);

// * attach not found
app.all('*', notFound);

// * global error handler
app.use(globalErrorHandler);

const serverPort = process.env.PORT;
let server: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;
const startServer = async () => {
  try {
    await connectDb();
    server = app.listen(serverPort, () => {
      console.log(`server is listening to port: ${serverPort}`);
    });
  } catch (err) {
    console.log(`server failed to start:${err}`);
  }
};

startServer();

// * handle on handled rejections
// TODO => it is better to restart the server after that
process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => process.exit(1));
    return;
  }
  process.exit(1);
});
