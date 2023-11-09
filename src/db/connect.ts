import { connect } from 'mongoose';

const connectDB = () => {
  return connect(process.env.DB_URI as string, {
    dbName: 'natours',
  });
};

export { connectDB };
