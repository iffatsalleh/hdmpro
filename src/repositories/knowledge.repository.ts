import { prisma } from "@/lib/db/prisma";
import type { KnowledgeDocument, KnowledgeChunk } from "@prisma/client";

export class KnowledgeRepository {
  async createDocumentWithChunks(data: {
    title: string;
    category: string;
    content: string;
    source?: string;
    status?: string;
    chunks: string[];
  }): Promise<KnowledgeDocument & { chunks: KnowledgeChunk[] }> {
    return prisma.knowledgeDocument.create({
      data: {
        title: data.title,
        category: data.category,
        content: data.content,
        source: data.source,
        status: data.status ?? "PUBLISHED",
        chunks: {
          create: data.chunks.map((chunkContent) => ({
            content: chunkContent,
          })),
        },
      },
      include: {
        chunks: true,
      },
    });
  }

  async getAllDocuments() {
    return prisma.knowledgeDocument.findMany({
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async searchRelevantChunks(query: string, limit = 3): Promise<KnowledgeChunk[]> {
    const keywords = query
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((k) => k.length > 2);

    if (keywords.length === 0) {
      return [];
    }

    // Keyword relevance search across published knowledge chunks
    return prisma.knowledgeChunk.findMany({
      where: {
        document: {
          status: "PUBLISHED",
        },
        OR: keywords.map((word) => ({
          content: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      take: limit,
      include: {
        document: {
          select: { title: true, category: true },
        },
      },
    });
  }
}

export const knowledgeRepository = new KnowledgeRepository();
