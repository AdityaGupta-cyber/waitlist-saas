//initialize drizzle and db connection
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// if(!process.env.DB_URL) {
//     console.log(process.env.DB_URL)
//     throw new Error("DB_URL is not set");
// }
export const initializeDB = async () => {
    try {
        const client = new Client({
            host: "localhost",
            user: "postgres",
            password: "root",
            database: "waitlist",
            port: 5433
        });
        await client.connect();
        console.log("Database connection established");
        return drizzle(client);
    } catch (error) {
        console.error("Database connection failed:", error);
        throw new Error("Failed to initialize database");
    }
}   
