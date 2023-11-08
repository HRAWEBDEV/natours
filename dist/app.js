import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
// * config global middlewares
process.env.NODE_ENV !== 'production' && app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
// * starting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is listening to port:${port}`);
});
//# sourceMappingURL=app.js.map