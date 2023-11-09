import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
dotenv.config();
const app = express();
// * config global middlewares
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
// * starting server
const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(port);
        console.log(`server is listening to port:${port}`);
    }
    catch (err) {
        console.log('server start failed', err);
    }
};
startServer();
//# sourceMappingURL=app.js.map