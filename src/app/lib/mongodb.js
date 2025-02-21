// src/app/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local file");
}

const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Cache the MongoDB client in development to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client instance each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
