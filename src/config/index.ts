import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw Error(`Missing required environment varible: ${name}`);
  }

  return value;
}

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '3000',
  databaseUrl: requireEnv('DATABASE_URL'),
  session_secret: requireEnv('SESSION_SECRET'),
  dummyHash: requireEnv('DUMMY_HASH'),
};
