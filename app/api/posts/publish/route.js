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

// ── Stub platform handlers ──
// Wire up real OAuth / SDK calls here when ready

async function postToTwitter(post)   { return { platform: 'twitter',   success: true }; }
async function postToLinkedin(post)  { return { platform: 'linkedin',  success: true }; }
async function postToInstagram(post) { return { platform: 'instagram', success: true }; }
async function postToFacebook(post)  { return { platform: 'facebook',  success: true }; }
async function postToBlog(post)      { return { platform: 'blog',      success: true }; }
async function postToThreads(post)   { return { platform: 'threads',   success: true }; }

const PLATFORM_HANDLERS = {
  twitter:   postToTwitter,
  linkedin:  postToLinkedin,
  instagram: postToInstagram,
  facebook:  postToFacebook,
  blog:      postToBlog,
  threads:   postToThreads,
};

export async function POST(req) {
  try {
    const { topic, description, post, platforms, date } = await req.json();

    if (!post?.trim()) {
      return Response.json({ error: { message: 'Post content is required.' } }, { status: 400 });
    }

    if (!platforms || platforms.length === 0) {
      return Response.json({ error: { message: 'At least one platform is required.' } }, { status: 400 });
    }

    // Step 1 — call each platform stub
    const platformResults = await Promise.allSettled(
      platforms.map((p) => {
        const handler = PLATFORM_HANDLERS[p];
        return handler
          ? handler({ topic, post, platforms })
          : Promise.resolve({ platform: p, success: false, error: 'Unknown platform' });
      })
    );

    const results = platformResults.map((r) =>
      r.status === 'fulfilled' ? r.value : { success: false, error: r.reason?.message }
    );

    // Step 2 — save to MongoDB (no image)
    await getClient();
    const db = client.db('stravon_cms');

    await db.collection('posts').insertOne({
      topic:       topic ?? '',
      description: description ?? '',
      post,
      platforms,
      date:        date ? new Date(date) : new Date(),
      createdAt:   new Date(),
      results,
    });

    return Response.json({ success: true, results });
  } catch (err) {
    return Response.json(
      { error: { message: err.message || 'Failed to publish post.' } },
      { status: 500 }
    );
  }
}