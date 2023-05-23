import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "";
const client = new MongoClient(connectionString);

try {
  await client.connect();
} catch (error) {
  await client.close();
  throw error;
}

const bakiAuctionsDB = client.db("bakiAuctionsDB");
const users = bakiAuctionsDB.collection("users");
const sessions = bakiAuctionsDB.collection("sessions");
const lots = bakiAuctionsDB.collection("lots");

export { client as mongoDBClient, users, sessions, lots };
