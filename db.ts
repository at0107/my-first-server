import * as dotenv from 'dotenv';
import { Client } from 'pg';
dotenv.config()
const connectionString = process.env.DB_URL;
const client = new Client({
    connectionString: connectionString,
})
client.connect()
    .then(() => console.log("Success to connect PostgreSQL"))
    .catch((err:any) => console.error("Connect failed", err));

export default client;