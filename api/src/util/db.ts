import { Client, QueryResult } from 'pg';
const client = new Client({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT!),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE
});
let isConnected = false;

/**
 * Queries the database, connects if not connected yet.
 * @param query the query to execute.
 * @param values the values for the query.
 * @returns the result of the query.
 */
export const query = async (query: string, values?: any[]): Promise<QueryResult<any>> => {
  if(!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return await client.query(query, values);
};