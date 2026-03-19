import * as dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

export default {
  schema: 'apps/api/src/schema.ts',
  out: 'apps/api/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
};
