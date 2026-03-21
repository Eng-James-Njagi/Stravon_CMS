import { getDb } from '../../lib/mongodb';

export async function GET() {
  try {
    const db    = await getDb();
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

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