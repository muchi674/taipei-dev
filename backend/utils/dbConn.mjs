import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "";
const client = new MongoClient(connectionString);
let conn;

try {
  conn = await client.connect();
} catch (error) {
  console.error(error);
}

let db = conn.db("bakiAuctionsDB");

export default db;
