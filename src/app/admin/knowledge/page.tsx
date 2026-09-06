import { knowledgeService } from "@/services/knowledge.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addDocumentAction(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;

  if (title && content) {
    await knowledgeService.addKnowledgeDocument({
      title,
      category: category || "GENERAL",
      content,
    });
    revalidatePath("/admin/knowledge");
  }
}

export default async function AdminKnowledgePage() {
  let documents: any[] = [];
  try {
    documents = await knowledgeService.listDocuments();
  } catch {
    documents = [];
  }

  return (
    <div className="mx-auto max-w-4xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Portal Admin HDMPro
          </span>
          <h1 className="text-2xl font-black tracking-tight">Pengurusan RAG Knowledge Base</h1>
          <p className="text-xs text-muted-foreground">
            Dokumen metodologi HDM rasmi yang dirujuk oleh AI Coach semasa perbualan.
          </p>
        </div>
      </div>

      {/* Form Tambah Dokumen */}
      <Card className="flex flex-col gap-4 p-5 bg-card border-border">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold">Tambah Dokumen Pengetahuan HDM</h2>
        </div>

        <form action={addDocumentAction} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Tajuk Dokumen</label>
              <input
                name="title"
                placeholder="cth: Prinsip Defisit Kalori & Disiplin HDM"
                required
                className="rounded-xl bg-input px-3 py-2 text-sm text-foreground border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">Kategori</label>
              <select
                name="category"
                className="rounded-xl bg-input px-3 py-2 text-sm text-foreground border border-border focus:border-primary focus:outline-none"
              >
                <option value="METODOLOGI">Metodologi & Prinsip HDM</option>
                <option value="NUTRISI">Nutrisi & Makro</option>
                <option value="PLATEAU">Panduan Plateau & Refeed</option>
                <option value="FAQ">Soalan Lazim (FAQ)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Kandungan Dokumen (Akan dipecahkan kepada Chunks secara automatik)
            </label>
            <textarea
              name="content"
              rows={4}
              placeholder="Masukkan teks panduan atau prinsip rasmi HDM..."
              required
              className="rounded-xl bg-input px-3 py-2 text-sm text-foreground border border-border focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" size="md" className="self-end">
            Simpan & Jana Chunks
          </Button>
        </form>
      </Card>

      {/* Senarai Dokumen Sedia Ada */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Dokumen Diterbitkan ({documents.length})
        </h2>

        {documents.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted-foreground border-dashed">
            Belum ada dokumen RAG. Tambah dokumen pertama di atas.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex flex-col justify-between gap-3 p-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {doc.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                      <CheckCircle2 className="h-3 w-3" /> {doc.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{doc.content}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {doc._count.chunks} Chunks
                  </span>
                  <span>{new Date(doc.createdAt).toLocaleDateString("ms-MY")}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
