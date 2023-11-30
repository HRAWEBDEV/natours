import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDb } from './db/connect.js';
import { router as tourRouter } from './routes/tourRoute.js';
import { replaceQueryOperator } from './middlewares/replaceQueryOperators.js';
import { notFound } from './middlewares/notFound.js';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
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
// * global error handler
app.use(globalErrorHandler);
const serverPort = process.env.PORT;
let server = null;
const startServer = async () => {
    try {
        await connectDb();
        server = app.listen(serverPort, () => {
            console.log(`server is listening to port: ${serverPort}`);
        });
    }
    catch (err) {
        console.log(`server failed to start:${err}`);
    }
};
startServer();
// * handle on handled rejections
// TODO => it is better to restart the server after that
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => process.exit(1));
        return;
    }
    process.exit(1);
});
// * add uncaught exception handler
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => process.exit(1));
        return;
    }
    process.exit(1);
});
//# sourceMappingURL=app.js.map