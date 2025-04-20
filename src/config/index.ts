import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): any {
  const value = process.env[name];
  if (!value) {
    throw Error(`Missing required environment varible: ${name}`);
  }

  return value;
}

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '3000',
  file_num_limit: requireEnv('FILE_NUM_LIMIT'),
  file_size_limit: requireEnv('FILE_SIZE_LIMIT'),
  databaseUrl: requireEnv('DATABASE_URL'),
  session_secret: requireEnv('SESSION_SECRET'),
  dummyHash: requireEnv('DUMMY_HASH'),
  supabase_url: requireEnv('SUPABASE_URL'),
  supabase_private_key: requireEnv('SUPABASE_PRIVATE_KEY'),
  supabase_bucket: requireEnv('SUPABASE_BUCKET'),
};
