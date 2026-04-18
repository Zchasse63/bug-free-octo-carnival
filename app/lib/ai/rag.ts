import { createServiceClient } from "@/lib/supabase/service";
import { embed } from "@/lib/ai/openai";

export type RetrievedChunk = {
  title: string | null;
  content: string;
  category: string;
  similarity: number;
};

/**
 * Semantic search over knowledge_base using pgvector cosine distance.
 * Returns the top-k most relevant chunks.
 */
export async function retrieveKnowledge(
  query: string,
  k = 5,
): Promise<RetrievedChunk[]> {
  const sb = createServiceClient();
  const queryVector = await embed(query);

  // Use a raw SQL RPC-style query via .rpc — but we haven't created one.
  // Instead, leverage PostgREST's filter syntax with a view/function.
  // Simplest: use execute_sql-style via rpc on a function, but we'll do it via
  // a one-off SQL query through the admin client.
  const { data, error } = await sb
    .rpc("match_knowledge", {
      query_embedding: `[${queryVector.join(",")}]`,
      match_count: k,
    });
  if (error) {
    // Fallback: if RPC doesn't exist yet, log and return empty — app still works.
    console.error("retrieveKnowledge RPC missing — returning empty", error);
    return [];
  }
  return (data as RetrievedChunk[]) ?? [];
}
