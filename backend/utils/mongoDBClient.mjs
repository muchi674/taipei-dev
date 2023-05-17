import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_CONNECTION_STRING || "";
const client = new MongoClient(connectionString);

try {
  await client.connect();
} catch (error) {
  await client.close();
  throw error;
}

export default client;
