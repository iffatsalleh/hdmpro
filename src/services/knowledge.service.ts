import { knowledgeRepository, KnowledgeRepository } from "@/repositories/knowledge.repository";

export class KnowledgeService {
  constructor(private repo: KnowledgeRepository = knowledgeRepository) {}

  chunkContent(text: string, maxChunkLength = 500): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;

      if ((currentChunk + "\n\n" + trimmed).length > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmed;
      } else {
        currentChunk = currentChunk ? currentChunk + "\n\n" + trimmed : trimmed;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text.trim()];
  }

  async addKnowledgeDocument(params: {
    title: string;
    category: string;
    content: string;
    source?: string;
  }) {
    const chunks = this.chunkContent(params.content);
    return this.repo.createDocumentWithChunks({
      ...params,
      chunks,
    });
  }

  async getRAGContextForQuery(query: string): Promise<string> {
    const relevantChunks = await this.repo.searchRelevantChunks(query, 3);
    if (relevantChunks.length === 0) {
      return "";
    }

    const formatted = relevantChunks
      .map((c, i) => `[Rujukan HDM #${i + 1}]:\n${c.content}`)
      .join("\n\n");

    return `\n\n--- RUJUKAN METODOLOGI RASMI HDM (RAG) ---\n${formatted}\n--- TAMAT RUJUKAN ---`;
  }

  async listDocuments() {
    return this.repo.getAllDocuments();
  }
}

export const knowledgeService = new KnowledgeService();
