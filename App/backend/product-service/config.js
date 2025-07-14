import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5002,
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/productdb',
};
