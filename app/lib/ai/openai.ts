const EMBED_URL = "https://api.openai.com/v1/embeddings";

export async function embed(text: string): Promise<number[]> {
  const res = await fetch(EMBED_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI embed failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data[0].embedding;
}

export async function embedMany(inputs: string[]): Promise<number[][]> {
  // Batch up to 100 per request per OpenAI limits
  const out: number[][] = [];
  for (let i = 0; i < inputs.length; i += 100) {
    const chunk = inputs.slice(i, i + 100);
    const res = await fetch(EMBED_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: chunk,
      }),
    });
    if (!res.ok)
      throw new Error(`OpenAI embedMany failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { data: { embedding: number[] }[] };
    for (const d of json.data) out.push(d.embedding);
  }
  return out;
}
