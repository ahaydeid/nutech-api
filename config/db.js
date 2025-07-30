import { Pool } from 'pg';
require('dotenv').config();

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default db;
