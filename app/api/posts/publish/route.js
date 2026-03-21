import { getDb } from '../../../lib/mongodb';

// ── Stub platform handlers ──
async function postToTwitter()   { return { platform: 'twitter',   success: true }; }
async function postToLinkedin()  { return { platform: 'linkedin',  success: true }; }
async function postToInstagram() { return { platform: 'instagram', success: true }; }
async function postToFacebook({ post }) {
  const pageId    = process.env.FACEBOOK_PAGE_ID;
  const pageToken = process.env.FACEBOOK_PAGE_TOKEN;

  if (!pageId || !pageToken) {
    return { platform: 'facebook', success: false, error: 'Facebook credentials not configured.' };
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message:      post,
        access_token: pageToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data?.error?.message || 'Facebook post failed.');
  }

  return { platform: 'facebook', success: true, postId: data.id };
}
async function postToBlog()      { return { platform: 'blog',      success: true }; }
async function postToThreads()   { return { platform: 'threads',   success: true }; }

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

    // Step 1 — call each platform handler
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

    // Step 2 — save to MongoDB
    const db = await getDb();

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