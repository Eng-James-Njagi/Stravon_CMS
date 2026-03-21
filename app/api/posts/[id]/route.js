import { ObjectId } from 'mongodb';
import { getDb } from '../../../lib/mongodb';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json({ error: { message: 'Post ID is required.' } }, { status: 400 });
    }

    const db     = await getDb();
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