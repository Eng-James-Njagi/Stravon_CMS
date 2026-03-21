import { getDb } from '../../lib/mongodb';

const MISTRAL = 'mistral';
const CHATGPT  = 'gpt';
const CLAUDE   = 'claude';

// ── Tavily web search ──
async function fetchTavilyResults(query) {
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key:             process.env.TAVILY_API_KEY,
        query,
        search_depth:        'basic',
        include_answer:      true,
        include_raw_content: false,
        max_results:         5,
        topic:               'news',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data  = await response.json();
    const parts = [];

    if (data?.answer) {
      parts.push(`Summary: ${data.answer}`);
      parts.push('');
    }

    const results = data?.results ?? [];
    results.slice(0, 5).forEach((r, i) => {
      parts.push(`${i + 1}. ${r.title}`);
      if (r.content) parts.push(`   ${r.content.slice(0, 200)}…`);
    });

    return parts.length > 0 ? parts.join('\n') : null;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[Tavily] Timed out — skipping web context.');
    } else {
      console.error('[Tavily] Error:', err.message);
    }
    return null;
  }
}

// ── MongoDB exact topic check ──
async function findPastPost(topic) {
  try {
    const db   = await getDb();
    const past = await db
      .collection('posts')
      .findOne(
        { topic: { $regex: `^${topic.trim()}$`, $options: 'i' } },
        { sort: { createdAt: -1 } }
      );
    return past ?? null;
  } catch (err) {
    console.error('[MongoDB] Past post lookup failed:', err.message);
    return null;
  }
}

export async function POST(req) {
  try {
    const { topic, description, platform, model } = await req.json();

    if (!topic?.trim()) {
      return Response.json({ error: { message: 'Topic is required.' } }, { status: 400 });
    }

    if (model === MISTRAL) {

      const agentId = process.env.mistral_agent_id;
      if (!agentId) {
        return Response.json({ error: { message: 'Agent ID is not configured.' } }, { status: 500 });
      }

      // Step 1 — run DB check and Tavily in parallel
      const [pastPost, searchResults] = await Promise.all([
        findPastPost(topic),
        fetchTavilyResults(`${topic} latest trends ${new Date().getFullYear()}`),
      ]);

      // Step 2 — build prompt
      const prompt = [
        // web context
        searchResults
          ? `Here is recent information retrieved from the web about this topic — use it to make the post timely and relevant:`
          : null,
        searchResults ? searchResults : null,
        searchResults ? `` : null,

        // past post context
        pastPost
          ? `Here is a past post that was written on the same topic — use it for consistency of voice and style but DO NOT repeat it. The new post must be meaningfully different, offering a fresh angle, updated information, or a different perspective:`
          : null,
        pastPost ? `Past post: "${pastPost.post}"` : null,
        pastPost ? `` : null,

        // generation instruction
        `Now write a compelling, ready-to-publish post for ${platform ? platform.toUpperCase() : 'general social media'}.`,
        ``,
        `Topic: ${topic}`,
        description?.trim() ? `Additional context: ${description}` : null,
        ``,
        `Requirements:`,
        searchResults ? `- Reference current trends or recent developments from the web context above where relevant` : null,
        pastPost      ? `- Maintain consistency with the voice and style of the past post but avoid repeating the same points` : null,
        pastPost      ? `- Offer a fresh angle, new data, or a different perspective from the past post` : null,
        `- Tailor the tone, length, and format for ${platform ? platform : 'the platform'}`,
        `- Start with a strong opening line`,
        `- Make it engaging and informative`,
        `- Keep the post under 200 words`,
        `- Output only the post content — no preamble, no source citations, no meta-commentary`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      // Step 3 — call Mistral agent
      const mistralController = new AbortController();
      const mistralTimeoutId  = setTimeout(() => mistralController.abort(), 30000);

      const response = await fetch('https://api.mistral.ai/v1/agents/completions', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.mistral_api_key}`,
        },
        body: JSON.stringify({
          agent_id: agentId,
          messages: [{ role: 'user', content: prompt }],
        }),
        signal: mistralController.signal,
      });

      clearTimeout(mistralTimeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Mistral API error.');
      }

      const raw  = data?.choices?.[0]?.message?.content;
      const text = Array.isArray(raw)
        ? raw.map((b) => b.text ?? b.content ?? '').join('')
        : raw ?? '';

      // Step 4 — return generated text + pastPost if found
      return Response.json({
        content:  [{ type: 'text', text }],
        pastPost: pastPost
          ? { topic: pastPost.topic, post: pastPost.post }
          : null,
      });

    } else if (model === CHATGPT) {
      return Response.json(
        { error: { message: 'ChatGPT is not yet configured. Try Mistral.' } },
        { status: 400 }
      );

    } else if (model === CLAUDE) {
      return Response.json(
        { error: { message: 'Claude is not yet configured. Try Mistral.' } },
        { status: 400 }
      );

    } else {
      return Response.json(
        { error: { message: 'Unknown model selected. Try Mistral.' } },
        { status: 400 }
      );
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      return Response.json(
        { error: { message: 'Request timed out. Please try again.' } },
        { status: 504 }
      );
    }
    return Response.json(
      { error: { message: err.message || 'Internal server error.' } },
      { status: 500 }
    );
  }
}