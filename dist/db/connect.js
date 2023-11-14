import { connect } from 'mongoose';
const connectDb = () => {
    return connect(process.env.DB_URI, {
        dbName: 'natours',
    });
};
export { connectDb };
//# sourceMappingURL=connect.js.map