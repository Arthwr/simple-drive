import dotenv from 'dotenv';

dotenv.config();

export default {
  environment: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  session_secret: process.env.SESSION_SECRET,
  dummyHash: process.env.DUMMY_HASH,
};
