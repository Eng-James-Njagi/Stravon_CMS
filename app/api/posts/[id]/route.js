import { MongoClient, ObjectId } from 'mongodb';

let client;
let clientPromise;

function getClient() {
  if (!clientPromise) {
    client = new MongoClient(process.env.mongo_db_url);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: { message: 'Post ID is required.' } }, { status: 400 });
    }

    await getClient();
    const db     = client.db();
    const result = await db
      .collection('posts')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ error: { message: 'Post not found.' } }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { error: { message: err.message || 'Failed to delete post.' } },
      { status: 500 }
    );
  }
}