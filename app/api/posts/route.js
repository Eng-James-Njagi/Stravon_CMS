import { MongoClient } from 'mongodb';

let client;
let clientPromise;

function getClient() {
  if (!clientPromise) {
    client = new MongoClient(process.env.mongo_db_url);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function GET() {
  try {
    await getClient();
    const db    = client.db();
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // convert _id ObjectId to string for serialization
    const serialized = posts.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return Response.json({ posts: serialized });
  } catch (err) {
    return Response.json(
      { error: { message: err.message || 'Failed to fetch posts.' } },
      { status: 500 }
    );
  }
}