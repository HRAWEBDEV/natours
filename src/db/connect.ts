import { connect } from 'mongoose';

const connectDb = () => {
  return connect(process.env.DB_URI as string, {
    dbName: 'natours',
  });
};

export { connectDb };
