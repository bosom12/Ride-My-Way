import mongoose from 'mongoose';
import { config } from 'dotenv';
import User from './user';
import Ride from './ride';
import Request from './request';

config();

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose
  .connect(process.env.MONGODB_URL, option)
  .then(() => console.log('Mongodb connected!'))
  .catch(err => console.log(err.message));

export default { User, Ride, Request };
