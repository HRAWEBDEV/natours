import { connect } from 'mongoose';
const connectDB = () => {
    return connect(process.env.DB_URI, {
        dbName: 'natours',
    });
};
export { connectDB };
//# sourceMappingURL=connect.js.map