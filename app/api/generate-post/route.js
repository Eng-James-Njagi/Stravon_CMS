const MISTRAL = 'mistral';
const CHATGPT = 'gpt';
const CLAUDE = 'claude';

async function fetchTavilyResults(query) {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.tavily_api_key,
        query,
        search_depth: 'basic',
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
        topic: 'news',
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();

    const parts = [];

    // include tavily's own summary answer if available
    if (data?.answer) {
      parts.push(`Summary: ${data.answer}`);
      parts.push('');
    }

    // include top result snippets
    const results = data?.results ?? [];
    results.slice(0, 5).forEach((r, i) => {
      parts.push(`${i + 1}. ${r.title}`);
      if (r.content) parts.push(`   ${r.content.slice(0, 200)}…`);
    });

    return parts.length > 0 ? parts.join('\n') : null;
  } catch {
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

      // Step 1 — fetch recent context from Tavily
      const searchResults = await fetchTavilyResults(
        `${topic} latest trends ${new Date().getFullYear()}`
      );

      // Step 2 — build prompt
      const prompt = [
        searchResults
          ? `Here is recent information retrieved from the web about this topic — use it to make the post timely and relevant:`
          : null,
        searchResults ? searchResults : null,
        searchResults ? `` : null,

        `Now write a compelling, ready-to-publish post for ${platform ? platform.toUpperCase() : 'general social media'}.`,
        ``,
        `Topic: ${topic}`,
        description?.trim() ? `Additional context: ${description}` : null,
        ``,
        `Requirements:`,
        searchResults
          ? `- Reference current trends or recent developments from the web context above where relevant`
          : null,
        `- Tailor the tone, length, and format for ${platform ? platform : 'the platform'}`,
        `- Start with a strong opening line`,
        `- Make it engaging and informative`,
        `- Keep the post under 200 words`,
        `- Output only the post content — no preamble, no source citations, no meta-commentary`,
      ]
        .filter((line) => line !== null)
        .join('\n');

      // Step 3 — send to Mistral agent
      const response = await fetch('https://api.mistral.ai/v1/agents/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.mistral_api_key}`,
        },
        body: JSON.stringify({
          agent_id: agentId,
          messages: [ { role: 'user', content: prompt } ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Mistral API error.');
      }

      const raw = data?.choices?.[ 0 ]?.message?.content;
      const text = Array.isArray(raw)
        ? raw.map((b) => b.text ?? b.content ?? '').join('')
        : raw ?? '';

      return Response.json({
        content: [ { type: 'text', text } ],
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
    return Response.json(
      { error: { message: err.message || 'Internal server error.' } },
      { status: 500 }
    );
  }
}