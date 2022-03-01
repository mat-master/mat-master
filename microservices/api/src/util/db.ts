import { Client, QueryResult } from 'pg';
const client = new Client();
let isConnected = false;

/**
 * Queries the database, connects if not connected yet.
 * @param query the query to execute.
 * @param values the values for the query.
 * @returns the result of the query.
 */
export const query = async (query: string, values?: [any]): Promise<QueryResult<any>> => {
  if(!isConnected)
    await client.connect();
  return await client.query(query, values);
};