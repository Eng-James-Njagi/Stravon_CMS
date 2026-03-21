import { MongoClient } from 'mongodb';

const uri = process.env.mongo_db_url;

if (!uri) {
  throw new Error('mongo_db_url environment variable is not set.');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  // in development reuse the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // in production create a fresh client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(dbName = 'stravon_cms') {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;